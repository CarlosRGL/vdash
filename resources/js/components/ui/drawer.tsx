import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/utils';

const DrawerPositionContext = React.createContext<
  'left' | 'top' | 'right' | 'bottom'
>('bottom');

const Drawer = ({
  shouldScaleBackground = true,
  position = 'bottom',
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & {
  /**
   * Which edge of the viewport the drawer should slide in from.
   *
   * @remarks
   * - `'left'` — slides in from the left side
   * - `'top'` — slides down from the top
   * - `'right'` — slides in from the right side
   * - `'bottom'` — slides up from the bottom
   *
   * @default 'bottom'
   */
  position?: 'left' | 'top' | 'right' | 'bottom';
  children: React.ReactNode;
}) => (
  <DrawerPositionContext.Provider value={position}>
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      direction={position}
      {...props}
    >
      {children}
    </DrawerPrimitive.Root>
  </DrawerPositionContext.Provider>
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const ContentPositions = {
  left: 'right-auto -left-1 top-0 bottom-0 mt-0 rounded-r-[10px] pl-8',
  right: 'left-auto -right-1 top-0 bottom-0 mt-0 rounded-l-[10px] pr-8',
  top: 'top-0 bottom-auto mt-0 rounded-b-[10px] mx-auto pt-8',
  bottom: 'bottom-0 mt-24 rounded-t-[10px]',
} as const;

const LinePositions = {
  left: 'ml-auto h-1/12 top-1/2 -translate-y-1/2 w-2 mr-3',
  right: 'mr-auto h-1/12 top-1/2 -translate-y-1/2 w-2 ml-3',
  top: 'mx-auto w-1/12 h-2 mb-3',
  bottom: 'mx-auto mb-auto w-1/12 h-2 mt-3',
} as const;

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const position = React.useContext(DrawerPositionContext);

  const trailingLine = (
    <div
      className={cn('relative rounded-full bg-muted', LinePositions[position])}
    />
  );

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          'fixed inset-x-0 z-50 flex h-auto flex-col border bg-background dark:bg-background/80',
          ContentPositions[position],
          className,
        )}
        {...props}
      >
        {position !== 'top' && trailingLine}
        {children}
        {position === 'top' && trailingLine}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};