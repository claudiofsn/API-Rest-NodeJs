export class LateCheckInValidationError extends Error {
    constructor() {
        super('Cannot validate, it has already been more than twenty minutes for validation.');
    }
}
