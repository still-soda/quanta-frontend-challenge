interface SubmitActionPayload {
    challengeId: string;
    submissionId: string;
}

interface UploadActionPayload {
    imageId: string;
}

export type ActionsPayload = SubmitActionPayload | UploadActionPayload;