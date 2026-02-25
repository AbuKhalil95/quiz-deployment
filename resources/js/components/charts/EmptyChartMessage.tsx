export function EmptyChartMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            {children}
        </div>
    );
}
