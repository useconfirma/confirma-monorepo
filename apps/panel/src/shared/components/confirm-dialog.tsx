import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';

interface ConfirmDialogProps {
    /** Gatilho do diálogo (elemento único, ex.: `Button`). */
    children: ReactNode;
    title: string;
    description: ReactNode;
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => void;
}

/*
 * Pede confirmação antes de uma ação que não pode ser desfeita. Não controla
 * estado: abre pelo gatilho recebido em `children`, e confirmar fecha o
 * diálogo e chama `onConfirm`. Carregamento e erro ficam com quem dispara a
 * ação. O foco começa em cancelar, a escolha segura.
 */
export const ConfirmDialog = ({
    children,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancelar',
    onConfirm,
}: ConfirmDialogProps) => (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">{cancelLabel}</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button onClick={onConfirm}>{confirmLabel}</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
