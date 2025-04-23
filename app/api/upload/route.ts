import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { requireAuth } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('Image upload request received');

    const authResult = await requireAuth(request);

    if (!authResult.success) {
      console.log('Unauthorized upload attempt');
      return authResult.response;
    }

    const userId = authResult.userId;
    console.log('User authenticated:', userId);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file provided in the request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    try {
      // Convert file to buffer
      console.log('Converting file to buffer...');
      const buffer = Buffer.from(await file.arrayBuffer());
      console.log('Buffer created, size:', buffer.length);

      // Upload to Sanity
      console.log('Uploading to Sanity...');
      const asset = await sanityClient.assets.upload('image', buffer, {
        filename: file.name,
        contentType: file.type,
      });

      console.log('Upload successful, asset ID:', asset._id);
      return NextResponse.json({
        success: true,
        assetId: asset._id,
        url: asset.url,
      });
    } catch (uploadError) {
      console.error('Error during file processing or Sanity upload:', uploadError);
      return NextResponse.json({
        error: 'Failed to process or upload image',
        details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in upload handler:', error);
    return NextResponse.json({
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
