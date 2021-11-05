import { AzureClientProps, LOCAL_MODE_TENANT_ID } from "@fluidframework/azure-client";
import { InsecureTokenProvider } from "@fluidframework/test-runtime-utils";
import { SharedMap } from "fluid-framework";
import { generateUser } from './Utils';

export const useAzure = process.env.REACT_APP_FLUID_CLIENT === "useAzure";
export const user = generateUser();
export const containerSchema = {
    name: "brainstorm",
    initialObjects: {
        map: SharedMap,
    },
}

export const connectionConfig: AzureClientProps = useAzure ? { 
    connection: {
        tenantId: process.env.REACT_APP_TENANT_ID as string,
        tokenProvider: new InsecureTokenProvider(process.env.REACT_APP_PRIMARY_KEY as string, user),
        orderer: process.env.REACT_APP_ORDERER_ENDPOINT as string,
        storage: process.env.REACT_APP_STORAGE_ENDPOINT as string
    }
} : { 
    connection: {
        tenantId: LOCAL_MODE_TENANT_ID,
        tokenProvider: new InsecureTokenProvider("fooBar", user),
        orderer: "http://localhost:7070",
        storage: "http://localhost:7070",
    }
};