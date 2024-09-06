import { Message } from '@/models/user.models'

//NOTE - define types for api response
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;  //NOTE - optional property for type safety
    messages?: Array<Message>;  //NOTE - optional property for type safety
}