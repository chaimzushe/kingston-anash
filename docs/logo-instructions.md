# Logo Instructions

## Where to Place Your Logo

Your logo should be placed in the `public/images` directory. The current implementation is looking for a file named `logo.png` in this location.

## Logo Requirements

- **File Format**: PNG format with transparency is recommended
- **File Name**: logo.png
- **Size**: Ideally 200x200 pixels or larger (it will be displayed at 40x40 pixels in the navigation)
- **Background**: Transparent background works best

## How to Add Your Logo

1. Create or obtain your logo image
2. Rename it to `logo.png`
3. Place it in the `public/images` directory
4. The logo will automatically appear in the navigation bar

## Customizing the Logo Display

If you want to change how the logo is displayed, you can modify the `NavLogo.tsx` component:

- To change the size, update the `width` and `height` props in the Image component
- To change the styling, modify the CSS classes
- To change the logo file, update the `src` attribute

## Example

```jsx
<div className="relative w-10 h-10 overflow-hidden rounded-full bg-white/10">
  <Image 
    src="/images/logo.png" 
    alt="Kingston Anash Logo" 
    width={40} 
    height={40} 
    className="object-contain"
  />
</div>
```

You can adjust these values to fit your specific logo design.
