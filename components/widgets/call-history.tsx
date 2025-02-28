"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowsUpDown,
  FaChevronDown,
  FaDownload,
  FaEllipsis,
  FaFileArrowDown,
  FaPause,
  FaPlay,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { CallRecording } from "@/lib/types";

import { DatePickerWithRange } from "../ui/date-picker";
import { callRecordingsData } from "@/lib/sampleData";

// Sample data for Call Recordings
const callRecordingsData: CallRecording[] = [
  {
    id: "1",
    date: "2025/02/10",
    category: "Booking",
    confidenceScore: 9.8,
    duration: "0:18",
    recordingUrl: "https://actions.google.com/sounds/v1/cartoon/rainstick_slow.ogg",
    transcriptUrl: "https://example.com/recording1.pdf",
  },
  {
    id: "2",
    date: "2025/02/8",
    category: "Cancellation",
    confidenceScore: 9.9,
    duration: "0:50",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/barnyard_with_animals.ogg",
    transcriptUrl: "https://example.com/recording2.pdf",
  },
  {
    id: "3",
    date: "2025/02/18",
    category: "Reschedule",
    confidenceScore: 9.9,
    duration: "7:48",
    recordingUrl: "https://example.com/recording3.mp3",
    transcriptUrl: "https://example.com/recording3.pdf",
  },
  {
    id: "4",
    date: "2025/02/20",
    category: "General Inquiry",
    confidenceScore: 9.9,
    duration: "4:56",
    recordingUrl: "https://example.com/recording4.mp3",
    transcriptUrl: "https://example.com/recording4.pdf",
  },
  {
    id: "5",
    date: "2025/02/20",
    category: "Cancellation",
    confidenceScore: 9.9,
    duration: "6:12",
    recordingUrl: "https://example.com/recording5.mp3",
    transcriptUrl: "https://example.com/recording5.pdf",
  },
];

const RecordingCell = ({ recordingUrl, transcriptUrl, id }: { recordingUrl: string, transcriptUrl: string, id: string }) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex w-full flex-col items-center space-x-4">
      <Tabs
        defaultValue="recording"
        className={isMobile ? "w-[400px]" : "w-full"}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recording">Recording</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="recording" className="w-full">
          <div className="flex w-full items-center space-x-2">
            <Button variant="outline" size="sm" onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
            <Progress value={progress} className="w-full" />
            <audio
              ref={audioRef}
              src={recordingUrl}
              onEnded={() => {
                setIsPlaying(false);
                setProgress(0);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Download recording:", recordingUrl)}
            >
              <FaDownload />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="w-full">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaFileArrowDown />
              <span>{id}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Download transcript:", transcriptUrl)}
            >
              <FaDownload />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const columns: ColumnDef<CallRecording>[] = [
  {
    accessorKey: "id",
    header: "Call ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <FaArrowsUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "confidenceScore",
    header: "AI confidence score",
    cell: ({ row }) => <div>{row.getValue("confidenceScore")}</div>,
  },
  {
    accessorKey: "recording",
    header: "Recording",
    cell: ({ row }) => <div className="py-5"><RecordingCell recordingUrl={row.original.recordingUrl} 
                                                            transcriptUrl={row.original.transcriptUrl}
                                                            id = {row.original.id}/></div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const recording = row.original;

      return (
        <div className="mt-auto flex size-full flex-col items-center pb-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <FaEllipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(recording.id)}
              >
                Copy recording ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: callRecordingsData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: { sorting, columnFilters, columnVisibility},
  });


  return (
    <div id="call-history" className="w-full bg-card rounded-lg p-10">
      <div className="flex flex-col justify-between py-4 md:flex-row">
        <p className="text-m font-semibold md:text-2xl lg:text-3xl">
          Call history and transcripts
        </p>

        <div className="mt-2 flex flex-col gap-2 md:mt-0 md:flex-row lg:gap-4">
          <Input
            placeholder="Search"
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {/* Dropdown to filter by category */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-fit justify-between bg-inherit"
              >
                Category <FaChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Booking", "Cancellation", "General Inquiry", "Reschedule"].map(
                (status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={
                      table.getColumn("category")?.getFilterValue() === status
                    }
                    onCheckedChange={(value) =>
                      table
                        .getColumn("category")
                        ?.setFilterValue(value ? status : undefined)
                    }
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DatePickerWithRange />
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
