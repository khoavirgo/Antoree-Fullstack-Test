import React from "react";

interface Props {
    teachers: Teacher[];
    onEdit: (t: Teacher) => void;
    onDelete: (t: Teacher) => void;
}

export function TeacherList({ teachers, onEdit, onDelete }: Props) {
    if (teachers.length === 0) return <div>No teachers yet</div>;
    return (
        <div className="space-y-3">
            {teachers.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center">
                    <div>
                        <div className="font-semibold">{t.name}</div>
                        {t.email && <div className="text-sm text-gray-600">{t.email}</div>}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(t)} className="px-3 py-1 rounded border text-sm">Edit</button>
                        <button onClick={() => onDelete(t)} className="px-3 py-1 rounded border text-sm text-red-600">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
