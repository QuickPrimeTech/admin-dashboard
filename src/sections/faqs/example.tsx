// "use client";

// import { useCallback, useState } from "react";
// import { Plus, RepeatIcon, Settings2Icon, XIcon } from "lucide-react";
// import { AnimatePresence, LayoutGroup, motion } from "motion/react";
// import { toast } from "sonner";

// import { cn } from "@/lib/utils";
// import { Button } from "@ui/button";
// import SortableList, { Item, SortableListItem } from "@ui/sortable-list";

// /* ----------  NEW FAQ DEFAULTS  ---------- */
// const initialState: Item[] = [
//   {
//     id: 1,
//     text: "How do I reset my password?",
//     checked: false,
//     description:
//       "Click “Forgot password” on the login page. We’ll email you a secure link that expires in 15 minutes.",
//   },
//   {
//     id: 2,
//     text: "Do you offer a free trial?",
//     checked: false,
//     description:
//       "Yes—every plan starts with a 14-day free trial. No credit card required.",
//   },
//   {
//     id: 3,
//     text: "Can I change my plan later?",
//     checked: false,
//     description:
//       "Absolutely. Upgrade or downgrade at any time from Settings → Billing. Changes are pro-rated.",
//   },
// ];

// export function SortableListDemo() {
//   const [items, setItems] = useState<Item[]>(initialState);
//   const [openItemId, setOpenItemId] = useState<number | null>(null);

//   /* ----------  CORE LIST LOGIC  ---------- */
//   const handleCompleteItem = (id: number) =>
//     setItems((prev) =>
//       prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
//     );

//   const handleAddItem = () =>
//     setItems((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         text: "New question",
//         checked: false,
//         description: "Type your answer here …",
//       },
//     ]);

//   const handleResetItems = () => setItems(initialState);

//   const handleCloseOnDrag = useCallback(() => {
//     setItems((prev) => {
//       const updated = prev.map((i) =>
//         i.checked ? { ...i, checked: false } : i
//       );
//       return updated.some((i, idx) => i.checked !== prev[idx].checked)
//         ? updated
//         : prev;
//     });
//   }, []);

//   /* ----------  RENDER EACH FAQ CARD  ---------- */
//   const renderListItem = (
//     item: Item,
//     order: number,
//     onCompleteItem: (id: number) => void,
//     onRemoveItem: (id: number) => void
//   ) => {
//     const isOpen = item.id === openItemId;

//     const tabs = [
//       {
//         id: 0,
//         label: "Question",
//         content: (
//           <motion.div
//             initial={{ opacity: 0, filter: "blur(4px)" }}
//             animate={{ opacity: 1, filter: "blur(0px)" }}
//             transition={{
//               type: "spring",
//               bounce: 0.2,
//               duration: 0.75,
//               delay: 0.15,
//             }}
//             className="flex w-full flex-col pr-2 py-2"
//           >
//             <label className="text-xs text-neutral-400">FAQ question</label>
//             <motion.input
//               type="text"
//               value={item.text}
//               onChange={(e) => {
//                 const text = e.target.value;
//                 setItems((prev) =>
//                   prev.map((i) => (i.id === item.id ? { ...i, text } : i))
//                 );
//               }}
//               className="w-full rounded-lg border border-black/10 bg-neutral-800 px-3 py-2 text-white placeholder:text-white/30 focus:outline focus:outline-2 focus:outline-[#13EEE3]/80"
//             />
//           </motion.div>
//         ),
//       },
//       {
//         id: 1,
//         label: "Answer",
//         content: (
//           <motion.div
//             initial={{ opacity: 0, filter: "blur(4px)" }}
//             animate={{ opacity: 1, filter: "blur(0px)" }}
//             transition={{
//               type: "spring",
//               bounce: 0.2,
//               duration: 0.75,
//               delay: 0.15,
//             }}
//             className="flex w-full flex-col pr-2"
//           >
//             <label className="text-xs text-neutral-400">
//               Answer displayed to users
//             </label>
//             <textarea
//               value={item.description}
//               onChange={(e) => {
//                 const description = e.target.value;
//                 setItems((prev) =>
//                   prev.map((i) =>
//                     i.id === item.id ? { ...i, description } : i
//                   )
//                 );
//               }}
//               placeholder="Type the answer …"
//               className="h-[100px] w-full resize-none rounded-md bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline focus:outline-2 focus:outline-[#13EEE3]/80"
//             />
//           </motion.div>
//         ),
//       },
//     ];

//     return (
//       <SortableListItem
//         key={item.id}
//         item={item}
//         order={order}
//         isExpanded={isOpen}
//         onCompleteItem={onCompleteItem}
//         onRemoveItem={onRemoveItem}
//         handleDrag={handleCloseOnDrag}
//         className="my-2"
//         renderExtra={() => (
//           <div
//             className={cn(
//               "flex w-full items-center justify-center gap-2",
//               isOpen ? "py-1 px-1" : "py-3"
//             )}
//           >
//             <motion.button
//               layout
//               onClick={() => setOpenItemId(!isOpen ? item.id : null)}
//               className={cn(
//                 isOpen
//                   ? "absolute right-3 top-3 z-10"
//                   : "relative z-10 ml-auto mr-3"
//               )}
//             >
//               {isOpen ? (
//                 <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   <XIcon className="h-5 w-5 text-neutral-500" />
//                 </motion.span>
//               ) : (
//                 <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   <Settings2Icon className="stroke-1 h-5 w-5 text-white/80 hover:stroke-[#13EEE3]/70" />
//                 </motion.span>
//               )}
//             </motion.button>

//             <LayoutGroup id={`${item.id}`}>
//               <AnimatePresence mode="popLayout">
//                 {isOpen && (
//                   <motion.div className="flex w-full flex-col">
//                     <motion.div
//                       key="tabs"
//                       className="mb-2 flex w-full items-center justify-between pl-2"
//                       initial={{ opacity: 0, filter: "blur(4px)" }}
//                       animate={{ opacity: 1, filter: "blur(0px)" }}
//                       transition={{ type: "spring", bounce: 0, duration: 0.55 }}
//                     >
//                       <div className="flex items-center gap-2 pt-3">
//                         <div className="h-1.5 w-1.5 rounded-full bg-[#13EEE3]" />
//                         <span className="text-xs text-neutral-300/80">
//                           Changes
//                         </span>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => {
//                           setOpenItemId(null);
//                           toast.info("FAQ updated");
//                         }}
//                         className="h-7 rounded-lg bg-[#13EEE3]/80 hover:bg-[#13EEE3] hover:text-black text-black"
//                       >
//                         Apply Changes
//                       </Button>
//                     </motion.div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </LayoutGroup>
//           </div>
//         )}
//       />
//     );
//   };

//   /* ----------  UI SHELL  ---------- */
//   return (
//     <div className="md:px-4 w-full max-w-xl">
//       <div className="mb-9 rounded-2xl p-2 shadow-sm md:p-6 bg-black">
//         <div className="overflow-auto p-1 md:p-4">
//           <div className="flex flex-col space-y-2">
//             <div className="flex items-center gap-3">
//               <svg className="h-6 w-6 fill-neutral-500" viewBox="0 0 256 260">
//                 …
//               </svg>
//               <div>
//                 <h3 className="text-neutral-200">FAQs manager</h3>
//                 <a
//                   className="text-xs text-white/80"
//                   href="https://www.uilabs.dev"
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   Inspired by <span className="text-[#13EEE3]">@mrncst</span>
//                 </a>
//               </div>
//             </div>

//             <div className="flex items-center justify-between gap-4 py-2">
//               <button disabled={items.length > 5} onClick={handleAddItem}>
//                 <Plus className="dark:text-netural-100 h-5 w-5 text-neutral-500/80 hover:text-white/80" />
//               </button>
//               <button onClick={handleResetItems} data-tip="Reset FAQ list">
//                 <RepeatIcon className="dark:text-netural-100 h-4 w-4 text-neutral-500/80 hover:text-white/80" />
//               </button>
//             </div>

//             <SortableList
//               items={items}
//               setItems={setItems}
//               onCompleteItem={handleCompleteItem}
//               renderItem={renderListItem}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
