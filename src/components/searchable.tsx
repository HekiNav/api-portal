import { ReactNode } from "react";

export interface SearchableProps<K extends object> {
    items: {
        content: ReactNode,
        fields: {
            [key in keyof K]: string
        }
    },
    
}