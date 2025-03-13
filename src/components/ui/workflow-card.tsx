import type { WorkflowItem } from "@/lib/utils/workflow";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const IconWrapper: React.FC<{
  children: React.ReactNode;
  iconColor: string;
}> = ({ children, iconColor }) => (
  <div className="relative group">
    <div
      className={`absolute inset-0 bg-white opacity-25 rounded-full blur-sm transform group-hover:scale-125 transition-all duration-300 ease-in-out`}
    ></div>
    <div
      className={`relative z-10 p-4 bg-white rounded-full shadow-lg ${iconColor} transform group-hover:rotate-12 transition-all duration-300 ease-in-out`}
    >
      {children}
    </div>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
  </div>
);

const WorkflowCard: React.FC<WorkflowItem> = ({
  title,
  description,
  icon,
  gradient,
  iconColor,
  href,
  user,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={user ? href : "/signin"}>
      <div
        className={`p-6 rounded-xl cursor-pointer bg-gradient-to-br ${gradient} shadow-xl transition-all duration-300 ease-in-out transform md:hover:scale-105 hover:shadow-2xl overflow-hidden`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col items-start space-y-4 relative z-10">
          <IconWrapper iconColor={iconColor}>{icon}</IconWrapper>
          <h4 className="text-xl font-semibold text-white">{title}</h4>
          <p className="text-white/80">{description}</p>
          <ChevronRight
            className={`absolute bottom-0 right-0 text-white transform transition-all duration-300 ease-in-out ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0"
            }`}
            size={24}
          />
        </div>
        <div
          className={`absolute inset-0 bg-white opacity-0 transition-opacity duration-300 ease-in-out ${
            isHovered ? "opacity-10" : ""
          }`}
        ></div>
      </div>
    </Link>
  );
};

export default WorkflowCard;
