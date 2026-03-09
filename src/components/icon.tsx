import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";

export interface IconProps extends FontAwesomeIconProps, PropsWithChildren {
    boxed?: boolean
    small?: boolean
}

export default function Icon(props: IconProps) {
    const {boxed, small, ...otherProps} = props
    return (
        <div className={`${props.className || ""} flex items-center`}>
            <FontAwesomeIcon  {...{...otherProps, className: `${props.className}`}} widthAuto></FontAwesomeIcon>
        </div>
    )
} 