import SearchBar from "@/components/UI/SearchBar";
import Profile from "@/components/UI/Profile";

export default function Header() {
    return(
        <div className="flex items-center flex-row border-b-2 border-b-gray-700 py-2">
            <SearchBar/>
            <Profile/>
        </div>
    )
}