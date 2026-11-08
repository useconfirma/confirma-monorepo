import { Check, Copy } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';

type CopyStatus = 'idle' | 'copied' | 'failed';

interface SecretRevealDialogProps {
    title: string;
    description: string;
    secret: string;
    /** Rótulo lido antes do valor, ex.: "Nova API Key". */
    secretLabel: string;
    /** Texto do botão de copiar, ex.: "Copiar API Key". */
    copyLabel: string;
    /** Confirmação após copiar, ex.: "API Key copiada para a área de transferência." */
    copiedMessage: string;
    onClosed: () => void;
}

/*
 * Exibe uma única vez um segredo recém-criado (API Key, segredo de webhook).
 * Quem usa monta o diálogo só enquanto há um segredo a mostrar; ele já nasce
 * aberto. Ao fechar, depois da animação de saída, `onClosed` deve descartar o
 * segredo. Cliques fora não fecham, para o valor não se perder por engano;
 * Esc, "Fechar" e o X fecham.
 */
export const SecretRevealDialog = ({
    title,
    description,
    secret,
    secretLabel,
    copyLabel,
    copiedMessage,
    onClosed,
}: SecretRevealDialogProps) => {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(secret);
            setCopyStatus('copied');
        } catch {
            setCopyStatus('failed');
        }
    };

    return (
        <Dialog defaultOpen>
            <DialogContent
                className="max-w-lg"
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    copyButtonRef.current?.focus();
                }}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    onClosed();
                }}
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="mt-5 space-y-2">
                    <p className="sr-only">{secretLabel}:</p>
                    <code className="rounded-control border-border bg-surface-muted text-foreground block border px-3 py-2.5 font-mono text-sm break-all select-all">
                        {secret}
                    </code>
                    <p role="status" className="text-xs">
                        {copyStatus === 'copied' && (
                            <span className="text-success">
                                {copiedMessage}
                            </span>
                        )}
                        {copyStatus === 'failed' && (
                            <span className="text-danger">
                                Não foi possível copiar. Selecione o valor e
                                copie manualmente.
                            </span>
                        )}
                    </p>
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="secondary">Fechar</Button>
                    </DialogClose>
                    <Button
                        ref={copyButtonRef}
                        onClick={() => void handleCopy()}
                    >
                        {copyStatus === 'copied' ? (
                            <Check aria-hidden="true" className="size-4" />
                        ) : (
                            <Copy aria-hidden="true" className="size-4" />
                        )}
                        {copyLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
