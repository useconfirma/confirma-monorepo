import { useGetAccount } from '@/shared/hooks/use-get-account.hook';
import { PageHeader } from '@/shared/components/page-header';
import { IntegrationOverview } from '../components/integration-overview';

const OverviewScreen = () => {
    const { data } = useGetAccount();

    return (
        <>
            <PageHeader
                title="Visão geral"
                description="A configuração da integração da sua conta em um só lugar."
            />

            {data && <IntegrationOverview account={data.account} />}
        </>
    );
};

export default OverviewScreen;
