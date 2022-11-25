import React, {memo, useEffect, useState} from 'react';
import {Box, Avatar as GrommetAvatar, Text, AvatarExtendedProps} from "grommet";
import {User} from "grommet-icons";
import {service} from "../config";
import Helpers from "../common/helpers";

interface IProps {
    src?: string;
    icon?: React.ReactNode;
    avatarProps?: Omit<AvatarExtendedProps, "src">;
}

function Avatar(props: IProps) {
    const [avatarLoadError, setAvatarLoadError] = useState(false);
    const {src, avatarProps} = props;
    useEffect(() => {
        setAvatarLoadError(false);
    }, [src])

    if (avatarLoadError || Helpers.isNullOrEmpty(src)) {
        return <div className="border rounded-circle overflow-hidden">
            <GrommetAvatar background="active" {...avatarProps}>
                {props.icon || <User color="text-strong"/>}
            </GrommetAvatar></div>
    }
    return <div className="border rounded-circle overflow-hidden">
        <GrommetAvatar
            background="active" src={service.assetUrl + src}
            onError={() => {
                setAvatarLoadError(true)
            }} {...avatarProps} />
    </div>
}

export default memo(Avatar, (prevProps, nextProps) => prevProps.src === nextProps.src);