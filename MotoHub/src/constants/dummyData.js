import { Share } from "react-native";

export const USER = {
    name: "Hari",
    email: "hari@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
};

export const VEHICLES = [
    {
        id: 1,
        name: "Toyota Camry",
        model: "2022",
        licensePlate: "KA 05 MN 2024",
        tankCapacity: 50, // Liters
        currentFuel: 35,
    }
];

export const EXPENSES_SUMMARY = {
    total: 12450,
    currency: "₹",
    month: "December"
};

export const RECENT_LOGS = [
    {
        id: "1",
        type: "Fuel",
        date: "20 Dec 2024",
        cost: 2500,
        amount: "25 L",
        location: "Shell Station, Indiranagar",
        icon: "droplet"
    },
    {
        id: "2",
        type: "Service",
        date: "15 Dec 2024",
        cost: 4500,
        description: "Oil Change & General Checkup",
        location: "Toyota Service Center",
        icon: "tool"
    },
    {
        id: "3",
        type: "Parking",
        date: "12 Dec 2024",
        cost: 200,
        location: "Phoenix Mall",
        icon: "parking-square" // map to lucide icon name
    }
];

export const CATEGORIES = [
    { id: 1, name: "Fuel", icon: "droplet", color: "#FF9800" },
    { id: 2, name: "Service", icon: "tool", color: "#2196F3" },
    { id: 3, name: "Parking", icon: "parking-square", color: "#9C27B0" },
    { id: 4, name: "Insurance", icon: "shield", color: "#4CAF50" },
    { id: 5, name: "Other", icon: "file-text", color: "#607D8B" },
];
