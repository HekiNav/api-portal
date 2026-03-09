import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";

export interface IconProps extends FontAwesomeIconProps, PropsWithChildren {
}

export default function Icon(props: IconProps) {
    const {...otherProps} = props
    return (
        <div className={`${props.className || ""} flex items-center`}>
            <FontAwesomeIcon  {...{...otherProps, className: `${props.className}`}} widthAuto></FontAwesomeIcon>
        </div>
    )
} 