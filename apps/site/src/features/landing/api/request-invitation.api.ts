const apiUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

type RequestInvitationResponse = {
    accepted: true;
};

export const requestInvitation = async (
    email: string,
): Promise<RequestInvitationResponse> => {
    const response = await fetch(`${apiUrl}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Não foi possível solicitar o convite.');
    }

    return response.json() as Promise<RequestInvitationResponse>;
};
