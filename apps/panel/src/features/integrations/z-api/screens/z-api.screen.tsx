import { useGetAccount } from '@/shared/hooks/use-get-account.hook';
import { PageHeader } from '@/shared/components/page-header';
import { ZApiConfiguration } from '../components/z-api-configuration';
import { useConfigureZApi } from '../hooks/use-configure-z-api.hook';

const ZApiScreen = () => {
    const { data } = useGetAccount();
    const configuration = useConfigureZApi(data?.account.zApi);

    return (
        <>
            <PageHeader
                title="Z-API"
                description="Credenciais da instância Z-API que envia as mensagens pelo WhatsApp."
            />

            {data && (
                <ZApiConfiguration
                    zApi={data.account.zApi}
                    className="w-full"
                    {...configuration}
                />
            )}
        </>
    );
};

export default ZApiScreen;
