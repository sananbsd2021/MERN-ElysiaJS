export const response = {
    success: <T>(data: T, message: string = 'Success') => ({
        success: true,
        message,
        data
    }),
    error: (message: string = 'Error', data: any = null) => ({
        success: false,
        message,
        data
    })
}
