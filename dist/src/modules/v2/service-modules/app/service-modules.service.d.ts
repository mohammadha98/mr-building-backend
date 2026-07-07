import { CreateServiceMediaDto } from "./dto/create-service-media-module.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetServicesMediaDto } from "./dto/get-service-media-module.dto";
import { SaveCommentInServicesDto } from "./dto/save-comment.dto";
import { GetCommentsDto } from "./dto/get-comments.dto";
import IMetadata from "src/commons/contracts/IMetadata";
export declare class ServiceModulesService {
    private readonly prismaService;
    private readonly uploadService;
    constructor(prismaService: PrismaService);
    saveServiceInfo(body: SaveCommentInServicesDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            id: string;
            content: string;
            client: {
                id: number;
                name: string;
                surname: string;
            };
            replied_by: {
                id: string;
                content: string;
                is_replied: boolean;
                client: {
                    id: number;
                    name: string;
                    surname: string;
                };
            }[];
        };
    }>;
    getComments(query: GetCommentsDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: {
            id: string;
            content: string;
            ServicesCommentLikes: {
                clientID: number;
            }[];
            is_replied: boolean;
            client: {
                id: number;
                name: string;
                surname: string;
            };
            replied_by: {
                id: string;
                content: string;
                is_replied: boolean;
                client: {
                    id: number;
                    name: string;
                    surname: string;
                };
                ServicesCommentLikes: {
                    clientID: number;
                }[];
                replied_by: {
                    id: string;
                    content: string;
                    is_replied: boolean;
                    client: {
                        id: number;
                        name: string;
                        surname: string;
                    };
                    ServicesCommentLikes: {
                        clientID: number;
                    }[];
                    replied_by: {
                        id: string;
                        content: string;
                        is_replied: boolean;
                        client: {
                            id: number;
                            name: string;
                            surname: string;
                        };
                        ServicesCommentLikes: {
                            clientID: number;
                        }[];
                        replied_by: {
                            id: string;
                            content: string;
                            is_replied: boolean;
                            client: {
                                id: number;
                                name: string;
                                surname: string;
                            };
                            ServicesCommentLikes: {
                                clientID: number;
                            }[];
                        }[];
                    }[];
                }[];
            }[];
        }[];
        metadata: IMetadata;
    }>;
    actionForComment(comment_id: string, client_id: number): Promise<{
        status: number;
    }>;
    create(body: CreateServiceMediaDto): Promise<{
        status: number;
        result: {
            id: string;
            type: string;
            fileType: string;
            file: string;
        };
    } | {
        status: number;
        result?: undefined;
    }>;
    findAll(query: GetServicesMediaDto): Promise<{
        status: number;
        service?: undefined;
    } | {
        status: number;
        service: {
            info: {
                id: string;
                description: string;
            };
            media: {
                id: string;
                type: string;
                fileType: string;
                file: string;
            }[];
            total_comments: number;
        };
    }>;
    remove(id: string): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            type: string;
            fileType: string;
            file: string;
            creatorID: number;
        }, unknown, never> & {};
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
