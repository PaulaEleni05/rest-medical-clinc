import { Link } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild><Link to=''>Home</Link></NavigationMenuLink>
                </NavigationMenuItem>
               <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger>Doctors</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4 p-4">
                        <li>
                            <NavigationMenuLink asChild>
                            <Link to='/doctors'>All Doctors</Link>
                            </NavigationMenuLink>
                        </li>
                        <li>
                            <NavigationMenuLink asChild>
                            <Link to='/doctors/create'>Add Doctor</Link>
                            </NavigationMenuLink>
                        </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
               <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger>Patients</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4 p-4">
                        <li>
                            <NavigationMenuLink asChild>
                            <Link to='/patients'>All Patients</Link>
                            </NavigationMenuLink>
                        </li>
                        <li>
                            <NavigationMenuLink asChild>
                            <Link to='/patients/create'>Add Patient</Link>
                            </NavigationMenuLink>
                        </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
               <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger>Appointments</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-4 p-4">
                        <li>
                            <NavigationMenuLink asChild>
                            <Link to='/appointments'>View Appointments</Link>
                            </NavigationMenuLink>
                        </li>
                        <li>
                            <NavigationMenuLink asChild>
                            <Link to='/appointments/create'>Schedule Appointment</Link>
                            </NavigationMenuLink>
                        </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

