import { useGetAccount } from '@/shared/hooks/use-get-account.hook';
import { PageHeader } from '@/shared/components/page-header';
import { WebhookConfiguration } from '../components/webhook-configuration';

const WebhookScreen = () => {
    const { data } = useGetAccount();

    return (
        <>
            <PageHeader
                title="Webhook"
                description="Endereço HTTPS que recebe os eventos dos seus agendamentos."
            />

            {data && (
                <WebhookConfiguration
                    webhook={data.account.webhook}
                    className="w-full"
                />
            )}
        </>
    );
};

export default WebhookScreen;
