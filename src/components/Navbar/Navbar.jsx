import React from "react";
const navbarlinks=[
    {
        id:1,
        title: "Inicio",
        link: "#",
    },
    {
        id:2,
        title: "About me",
        link: "#About",
    },
    {
        id:3,
        title: "Proyects",
        link: "/",
    },
    {
        id:4,
        title: "Contact",
        link: "/",
    }
]
const Navbar = () =>  {
    return (
        <nav>
            <div className="flex justify-between items-center sm:px-12 sm:py-6 px-4 py-3">
                {/*Navbar image*/}
                <div>
                    <img src="" alt="" />
                </div>
                {/*NavBar links*/ }
                <div>
                    <ul className="flex  sm:space-x-3 space-x-4">
                        {navbarlinks.map((link)=>(
                            <li key={link.id}><a id="Navlink" className="text-black  sm:text-lg text-sm" href="link.link">{link.title}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Navbar