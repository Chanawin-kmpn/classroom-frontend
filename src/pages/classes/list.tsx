import { CreateButton } from '@/components/refine-ui/buttons/create';
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb';
import { ListView } from '@/components/refine-ui/views/list-view';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Subject, User } from '@/types';
import { useTable } from '@refinedev/react-table';
import { useList } from '@refinedev/core';
import { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ShowButton } from '@/components/refine-ui/buttons/show';

type Class = {
    id: number;
    name: string;
    inviteCode: string;
    status: 'active' | 'inactive' | 'archived';
    capacity: number;
    bannerUrl?: string;
    subject?: Subject;
    teacher?: User;
    createdAt?: string;
};

const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('all');

    const { query: subjectsQuery } = useList<Subject>({
        resource: 'subjects',
        pagination: {
            pageSize: 100,
        },
    });

    const { query: teacherQuery } = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
        pagination: {
            pageSize: 100,
        },
    });

    const subjects = subjectsQuery?.data?.data || [];
    const teachers = teacherQuery?.data?.data || [];

    const subjectFilters =
        selectedSubject === 'all'
            ? []
            : [
                  {
                      field: 'subject',
                      operator: 'eq' as const,
                      value: selectedSubject,
                  },
              ];

    const teacherFilters =
        selectedTeacher === 'all'
            ? []
            : [
                  {
                      field: 'teacher',
                      operator: 'eq' as const,
                      value: selectedTeacher,
                  },
              ];

    const searchFilters = searchQuery
        ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }]
        : [];

    const classColumns = useMemo<ColumnDef<Class>[]>(
        () => [
            {
                id: 'banner',
                accessorKey: 'bannerUrl',
                size: 100,
                header: () => <p className='column-title ml-2'>Banner</p>,
                cell: ({ getValue }) => {
                    const bannerUrl = getValue<string>();
                    return bannerUrl ? (
                        <img
                            src={bannerUrl}
                            alt='Class banner'
                            className='w-16 h-16 rounded object-cover'
                        />
                    ) : (
                        <div className='w-16 h-16 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground'>
                            No Image
                        </div>
                    );
                },
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className='column-title'>Class Name</p>,
                cell: ({ getValue }) => (
                    <span className='text-foreground'>
                        {getValue<string>()}
                    </span>
                ),
                filterFn: 'includesString',
            },
            {
                id: 'status',
                accessorKey: 'status',
                size: 120,
                header: () => <p className='column-title'>Status</p>,
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    const capitalizedStatus =
                        status.charAt(0).toUpperCase() + status.slice(1);
                    return (
                        <Badge
                            variant={
                                status === 'active' ? 'default' : 'secondary'
                            }
                        >
                            {capitalizedStatus}
                        </Badge>
                    );
                },
            },
            {
                id: 'subject',
                accessorKey: 'subject.name',
                size: 150,
                header: () => <p className='column-title'>Subject</p>,
                cell: ({ getValue }) => {
                    const subjectName = getValue<string>();
                    return subjectName ? (
                        <Badge variant='secondary'>{subjectName}</Badge>
                    ) : (
                        <span className='text-muted-foreground'>-</span>
                    );
                },
            },
            {
                id: 'teacher',
                accessorKey: 'teacher.name',
                size: 150,
                header: () => <p className='column-title'>Teacher</p>,
                cell: ({ getValue }) => {
                    const teacherName = getValue<string>();
                    return teacherName ? (
                        <span className='text-foreground'>{teacherName}</span>
                    ) : (
                        <span className='text-muted-foreground'>-</span>
                    );
                },
            },
            {
                id: 'capacity',
                accessorKey: 'capacity',
                size: 100,
                header: () => <p className='column-title'>Capacity</p>,
                cell: ({ getValue }) => (
                    <span className='text-foreground'>
                        {getValue<number>()}
                    </span>
                ),
            },
            {
                id: 'details',
                size: 140,
                header: () => <p className='column-title'>Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource='classes'
                        recordItemId={row.original.id}
                        variant='outline'
                        size='sm'
                    >
                        View
                    </ShowButton>
                ),
            },
        ],
        []
    );

    const classTable = useTable<Class>({
        columns: classColumns,
        refineCoreProps: {
            resource: 'classes',
            pagination: {
                pageSize: 10,
                mode: 'server',
            },
            filters: {
                permanent: [
                    ...subjectFilters,
                    ...teacherFilters,
                    ...searchFilters,
                ],
            },
            sorters: {
                initial: [{ field: 'createdAt', order: 'desc' }],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className='page-title'>Classes</h1>

            <div className='intro-row'>
                <p>Quick access to essential metrics and management tools</p>

                <div className='actions-row'>
                    <div className='search-field'>
                        <Search className='search-icon' />

                        <Input
                            type='text'
                            placeholder='Search by class name...'
                            className='pl-10 w-full'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className='flex gap-2 w-full sm:w-auto'>
                        <Select
                            value={selectedSubject}
                            onValueChange={setSelectedSubject}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Filter by subject' />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value='all'>
                                    All Subjects
                                </SelectItem>
                                {subjects.map((subject: Subject) => (
                                    <SelectItem
                                        key={subject.id}
                                        value={subject.name}
                                    >
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedTeacher}
                            onValueChange={setSelectedTeacher}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Filter by teacher' />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value='all'>
                                    All Teachers
                                </SelectItem>
                                {teachers.map((teacher: User) => (
                                    <SelectItem
                                        key={teacher.id}
                                        value={teacher.name}
                                    >
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <CreateButton resource='classes' />
                    </div>
                </div>
            </div>

            <DataTable table={classTable} />
        </ListView>
    );
};

export default ClassesList;
