import { useGetAccount } from '@/shared/hooks/use-get-account.hook';
import { PageHeader } from '@/shared/components/page-header';
import { SendWindowConfiguration } from '../components/send-window-configuration';

const SendWindowScreen = () => {
    const { data } = useGetAccount();

    return (
        <>
            <PageHeader
                title="Janela de envio"
                description="Horários do dia em que o Confirma pode enviar mensagens, no fuso que você escolher."
            />

            {data && (
                <SendWindowConfiguration
                    sendWindow={data.account.sendWindow}
                    className="w-full"
                />
            )}
        </>
    );
};

export default SendWindowScreen;
