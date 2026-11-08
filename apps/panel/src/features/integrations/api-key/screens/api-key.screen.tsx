import { useGetAccount } from '@/shared/hooks/use-get-account.hook';
import { PageHeader } from '@/shared/components/page-header';
import { ApiKeyConfiguration } from '../components/api-key-configuration';
import { useGenerateApiKey } from '../hooks/use-generate-api-key.hook';

const ApiKeyScreen = () => {
    const { data } = useGetAccount();
    const generation = useGenerateApiKey();

    return (
        <>
            <PageHeader
                title="API Key"
                description="Seu sistema usa esta chave para criar agendamentos. Ao gerar uma nova, a anterior deixa de funcionar."
            />

            {data && (
                <ApiKeyConfiguration
                    apiKey={data.account.apiKey}
                    className="w-full"
                    {...generation}
                />
            )}
        </>
    );
};

export default ApiKeyScreen;
