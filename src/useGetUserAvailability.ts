import { useState, useEffect } from 'react';
import { UserAvailability } from './Types';

export const eventBus = {
    on(event: string, callback: any) {
        document.addEventListener(event, (e: Event) => callback((e as CustomEvent).detail));
    },
    dispatch(eventName: string, data: any) {
        document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    },
    remove(event: string, callback: any) {
        document.removeEventListener(event, callback);
    },
};

export default function useGetUserAvailability(): [UserAvailability] {
    const [userAvailability, setUserAvailability] = useState<UserAvailability>({ userId: '', availability: '' });

    useEffect(() => {
        const updateUserAvailability = (data: UserAvailability) => {
            setUserAvailability(data);
        };

        eventBus.on('userAvailabilityChanged', updateUserAvailability);

        return () => {
            eventBus.remove('userAvailabilityChanged', updateUserAvailability);
        }
    }, []);

    return [userAvailability];
}

export const getUserAvailabilityValue = (userId: string, userAvailability: UserAvailability) => {
    if (userId === userAvailability?.userId) {
        return userAvailability.availability;
    }
    return null;
}