// ConfirmDialog.tsx
'use client';

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ConfirmDialog({
    open,
    onConfirm,
    onCancel,
    title = 'Xác nhận',
    message = 'Bạn có chắc muốn thực hiện hành động này?',
}: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
}) {
    return (
        <Dialog open={open} onOpenChange={(value) => !value && onCancel()}>
            <DialogContent className="bg-white shadow-lg z-[100] data-[state=open]:animate-fadeIn backdrop-blur-none bg-opacity-100">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground mb-4">{message}</div>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}
