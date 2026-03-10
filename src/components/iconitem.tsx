import { HTMLAttributes, JSX, ReactElement, ReactNode } from "react"
export interface IconItemProps extends React.PropsWithChildren {
    icon: {
        Icon: JSX.ElementType,
    } & HTMLAttributes<SVGElement>,
    reversed?: boolean
}
export default function IconItem({children, icon, reversed = false}: IconItemProps) {
    const {Icon, ...props} = icon
    return (
        <div className={`flex ${reversed ? "flex-row-reverse" : "flex-row"} items-center`}>
            <Icon {...props}/>
            {children}
        </div>
    )
}