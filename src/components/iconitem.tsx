import { HTMLAttributes, JSX } from "react"
export interface IconItemProps extends React.PropsWithChildren {
    icon: {
        Icon: JSX.ElementType,
    } & HTMLAttributes<HTMLSpanElement>,
    reversed?: boolean
}
export default function IconItem({children, icon, reversed = false}: IconItemProps) {
    const {Icon, ...props} = icon
    return (
        <div className={`flex ${reversed ? "flex-row-reverse" : "flex-row"} items-center`}>
            <span {...props}><Icon {...props}/></span>
            {children}
        </div>
    )
}