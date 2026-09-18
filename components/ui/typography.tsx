import { cn } from "@/lib/utils";
import React, { type ComponentPropsWithoutRef } from "react";

// https://stackoverflow.com/questions/54654303/using-a-forwardref-component-with-children-in-typescript

export function TypographyH1({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"h1"> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return (
    <h1
      ref={ref}
      className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
      {...props}
    />
  );
}

// Class 'border-b' was removed from the original shadcn/ui element. You can add it back in with a classname at the component level
export function TypographyH2({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return (
    <h2
      ref={ref}
      className={cn("scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0", className)}
      {...props}
    />
  );
}

export function TypographyH3({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"h3"> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return <h3 ref={ref} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />;
}

export function TypographyH4({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"h4"> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return <h4 ref={ref} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props} />;
}

export function TypographyP({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"p"> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return <p ref={ref} className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />;
}

export function TypographyBlockquote({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"blockquote"> & { ref?: React.Ref<HTMLQuoteElement> }) {
  return <blockquote ref={ref} className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />;
}

/* Typing references:
https://stackoverflow.com/questions/65361696/arguments-of-same-length-typescript
https://stackoverflow.com/questions/69507794/typescript-how-to-make-sure-two-props-of-a-functional-component-which-are-arra */
export const TypographyTable = <H extends string[]>({
  headers,
  rows,
}: {
  headers: [...H];
  rows: [...{ [I in keyof H]: string[] }];
}) => {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="m-0 border-t p-0 even:bg-muted">
            {headers.map((headerItem, index) => (
              <th
                key={index}
                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              >
                {headerItem}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="m-0 border-t p-0 even:bg-muted">
              {row.map((rowItem) => (
                <td
                  key={rowItem}
                  className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                >
                  {rowItem}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function TypographyList({ items }: { items: string[] }) {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      {items.map((item) => (
        <li key={item}>item</li>
      ))}
    </ul>
  );
}

export function TypographyInlineCode({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"code"> & { ref?: React.Ref<HTMLElement> }) {
  return (
    <code
      ref={ref}
      className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold", className)}
      {...props}
    />
  );
}

export function TypographyLead({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"p"> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return <p ref={ref} className={cn("text-xl text-muted-foreground", className)} {...props} />;
}

export function TypographyLarge({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} className={cn("text-lg font-semibold", className)} {...props} />;
}

export function TypographySmall({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"small"> & { ref?: React.Ref<HTMLElement> }) {
  return <small ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />;
}

export function TypographyMuted({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"p"> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function PageHeader1({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return <h2 ref={ref} className={cn("text-2xl font-bold tracking-tight", className)} {...props} />;
}

export function PageSubHeader1({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"p"> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return <p ref={ref} className={cn("text-muted-foreground", className)} {...props} />;
}

export function PageHeader2({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"h3"> & { ref?: React.Ref<HTMLHeadingElement> }) {
  return <h3 ref={ref} className={cn("text-lg font-medium", className)} {...props} />;
}

export function PageSubHeader2({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<"p"> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
