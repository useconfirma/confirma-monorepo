import { useGetAccount } from '@/shared/hooks/use-get-account.hook';
import { PageHeader } from '@/shared/components/page-header';
import { WebhookConfiguration } from '../components/webhook-configuration';
import { useConfigureWebhook } from '../hooks/use-configure-webhook.hook';

const WebhookScreen = () => {
    const { data } = useGetAccount();
    const configuration = useConfigureWebhook(data?.account.webhook);

    return (
        <>
            <PageHeader
                title="Webhook"
                description="Configure o endereço HTTPS do seu sistema que recebe os resultados das confirmações."
            />

            {data && (
                <WebhookConfiguration
                    webhook={data.account.webhook}
                    className="w-full"
                    {...configuration}
                />
            )}
        </>
    );
};

export default WebhookScreen;
