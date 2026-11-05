import { PageHeader } from '@/shared/components/page-header';

const ApiKeyScreen = () => {
    return (
        <PageHeader
            title="API Key"
            description="Seu sistema usa esta chave para criar agendamentos. Ao gerar uma nova, a anterior deixa de funcionar."
        />
    );
};

export default ApiKeyScreen;
