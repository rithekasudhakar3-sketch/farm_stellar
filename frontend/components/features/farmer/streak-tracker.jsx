// "use client"

// import { Flame, Sun } from "lucide-react"

// export function StreakTracker({ currentStreak, streakDays = [] }) {
//   // Generate last 7 days
//   const days = ["M", "T", "W", "T", "F", "S", "S"]
//   const today = new Date().getDay()

//   return (
//     <div className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-2xl p-5 border-2 border-accent/20 shadow-sm">
//       <div className="flex items-center gap-3 mb-4">
//         <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl animate-pulse">
//           <Flame className="w-6 h-6 text-white" />
//         </div>
//         <div>
//           <p className="text-2xl font-black text-foreground">{currentStreak} Days</p>
//           <p className="text-xs text-muted-foreground">Daily Streak</p>
//         </div>
//       </div>

//       {/* Week calendar */}
//       <div className="flex justify-between gap-1">
//         {days.map((day, idx) => {
//           const isActive = streakDays.includes(idx)
//           const isToday = idx === today

//           return (
//             <div key={idx} className="flex flex-col items-center gap-1">
//               <div
//                 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
//                   isActive
//                     ? "bg-gradient-to-br from-accent to-primary scale-110 shadow-lg"
//                     : "bg-muted/50 border border-border"
//                 } ${isToday ? "ring-2 ring-accent ring-offset-2" : ""}`}
//               >
//                 {isActive ? (
//                   <Sun className="w-4 h-4 text-white animate-spin-slow" />
//                 ) : (
//                   <span className="text-xs text-muted-foreground">{day}</span>
//                 )}
//               </div>
//               {!isActive && <span className="text-xs text-muted-foreground">{day}</span>}
//             </div>
//           )
//         })}
//       </div>

//       {/* Motivational text */}
//       <p className="text-xs text-center text-accent font-medium mt-4">
//         {currentStreak >= 7 ? "🎉 Amazing! You're on fire!" : "🌱 Keep it up!"}
//       </p>
//     </div>
//   )
// }
