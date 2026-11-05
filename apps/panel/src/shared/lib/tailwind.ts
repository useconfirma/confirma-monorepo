import { extendTailwindMerge, type ClassNameValue } from 'tailwind-merge';
import { createTV } from 'tailwind-variants';

// Ensina o tailwind-merge os tokens do styles.css que não seguem a escala padrão.
const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            radius: ['control', 'card', 'sheet'],
            shadow: ['popover', 'dialog'],
            tracking: ['caps'],
            ease: ['standard', 'enter', 'exit'],
            animate: [
                'fade-in',
                'fade-out',
                'scale-in',
                'slide-up',
                'slide-down',
            ],
            spacing: ['frame'],
        },
    },
});

export const cn = (...classes: ClassNameValue[]) => twMerge(classes);

export const tv = createTV({ twMerge: (classList) => twMerge(classList) });
