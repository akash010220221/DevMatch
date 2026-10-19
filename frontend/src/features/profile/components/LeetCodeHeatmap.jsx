import React, { useEffect, useState } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { BASE_URL } from '@/utils/constant';
import axios from 'axios';

const theme = {
    dark: ['#505050ff', '#1b7c12', '#35c20c', '#0cea26', '#16f930'],
};

function transformData(submissionCalendar) {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const entries = {};
    const calendar = typeof submissionCalendar === 'string' ? JSON.parse(submissionCalendar) : submissionCalendar;

    for (const [epoch, count] of Object.entries(calendar)) {
        const date = new Date(Number(epoch) * 1000);
        const key = date.toISOString().split('T')[0];
        entries[key] = (entries[key] || 0) + count;
    }

    const result = [];
    const cursor = new Date(oneYearAgo);
    while (cursor <= today) {
        const key = cursor.toISOString().split('T')[0];
        const count = entries[key] || 0;
        result.push({
            date: key,
            count,
            level: count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4,
        });
        cursor.setDate(cursor.getDate() + 1);
    }

    return result;
}

export default function LeetCodeHeatmap({ username }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeetCodeData = async () => {
            try {
                setLoading(true);
                const res = await axios.post(`${BASE_URL}/leetcode`, {
                    operationName: 'userProfileCalendar',
                    query: 'query userProfileCalendar($username: String!) { matchedUser(username: $username) { userCalendar { submissionCalendar } } }',
                    variables: { username },
                }, { withCredentials: true });

                const submissionCalendar = res.data.data?.matchedUser?.userCalendar?.submissionCalendar;
                if (!submissionCalendar) throw new Error('Data format invalid');
                
                setData(transformData(submissionCalendar));
            } catch (err) {
                console.error('LeetCode API error:', err);
                setError('Pulse unavailable');
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchLeetCodeData();
    }, [username]);

    if (loading) {
        return (
            <div className="bg-base-200/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 animate-pulse">
                <div className="h-4 w-40 bg-base-content/10 rounded mb-4"></div>
                <div className="h-[120px] bg-base-content/5 rounded-2xl"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-base-200/50 border border-white/5 rounded-3xl p-8 text-center text-[10px] font-black uppercase tracking-widest opacity-20">
                {error || 'Pulse Data Missing'}
            </div>
        );
    }

    return (
        <div className="bg-base-300/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/20 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">LeetCode Contribution</p>
                <div className="px-3 py-1 bg-success/10 text-success text-[8px] font-black rounded-full uppercase tracking-widest">Active Pulse</div>
            </div>
            
            <div className="overflow-x-auto overflow-y-hidden scrollbar-none pb-2">
                <div className="min-w-[700px]">
                    <ActivityCalendar
                        data={data}
                        theme={theme}
                        colorScheme="dark"
                        blockSize={12}
                        blockMargin={4}
                        blockRadius={3}
                        fontSize={11}
                        hideColorLegend
                        labels={{ totalCount: '{{count}} submissions' }}
                    />
                </div>
            </div>
        </div>
    );
}
