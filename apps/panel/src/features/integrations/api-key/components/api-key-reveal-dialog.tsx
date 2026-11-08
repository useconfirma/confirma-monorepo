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

/*
 * Exibe uma única vez a API Key recém-gerada. Quem usa monta o diálogo só
 * enquanto há uma chave a mostrar; ele já nasce aberto. Ao fechar, depois da
 * animação de saída, `onClosed` deve descartar a chave. Cliques fora não
 * fecham, para a chave não se perder por engano; Esc, "Fechar" e o X fecham.
 */
export const ApiKeyRevealDialog = ({
    apiKey,
    onClosed,
}: {
    apiKey: string;
    onClosed: () => void;
}) => {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(apiKey);
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
                    <DialogTitle>API Key gerada</DialogTitle>
                    <DialogDescription>
                        Copie a chave e guarde-a em um local seguro. Ela não
                        será exibida novamente depois que você fechar esta
                        janela.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-5 space-y-2">
                    <p className="sr-only">Nova API Key:</p>
                    <code className="rounded-control border-border bg-surface-muted text-foreground block border px-3 py-2.5 font-mono text-sm break-all select-all">
                        {apiKey}
                    </code>
                    <p role="status" className="text-xs">
                        {copyStatus === 'copied' && (
                            <span className="text-success">
                                API Key copiada para a área de transferência.
                            </span>
                        )}
                        {copyStatus === 'failed' && (
                            <span className="text-danger">
                                Não foi possível copiar. Selecione a chave e
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
                        Copiar API Key
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
