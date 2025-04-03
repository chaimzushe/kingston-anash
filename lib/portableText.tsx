import { PortableText as PortableTextComponent } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from './sanity';

// Custom components for the Portable Text renderer
const components = {
  types: {
    image: ({ value }: any) => {
      return (
        <div className="relative w-full h-96 my-6">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Blog post image'}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      const target = !value.href.startsWith('/') ? '_blank' : undefined;
      
      return (
        <Link 
          href={value.href}
          rel={rel}
          target={target}
          className="text-primary hover:text-secondary underline transition-colors duration-200"
        >
          {children}
        </Link>
      );
    },
  },
};

// Portable Text component with our custom components
export function PortableText({ content }: { content: any }) {
  return <PortableTextComponent value={content} components={components} />;
}
