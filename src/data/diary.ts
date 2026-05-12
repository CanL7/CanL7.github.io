// 日记数据配置
// 用于管理日记页面的数据

export interface DiaryItem {
	id: number;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

// 示例日记数据
const diaryData: DiaryItem[] = [
	{
		id: 1,
		content:
			"终于搭好了一个好看的博客！ 加油学习吧",
		date: "2026-03-12",
	},
{
		id: 2,
		content:
			"学着其实并不累 希望自己不要放弃呀！多往图书馆去 寝室学不了！ ",
		date: "2026-03-17",
	},
{
		id: 3,
		content:
			"学完JavaSE纪念！ 也是轻而易举啊 hhh(其实并非 ",
		date: "2026-03-24T00:00:00",
	},
	{
		id: 4,
		content:
			"这几天有点偷懒了...一直没学 今天才继续开始学(偶尔休息两天应该也还好吧..." +
			"应该的话4/10之前可以学完SSM 然后就可以开始写项目了! Karina真是五女一吧 不解释",
		date: "2026-04-07T19:30:00",
	},
	{
		id: 5,
		content:
			"好烦啊 高数 六级 物理 怎么都要学啊靠靠靠靠靠法法法法法" +
			"java进度也好慢 世界崩溃吧 额 嗯",
		date: "2026-05-12",
	},

];

// 获取日记统计数据
export const getDiaryStats = () => {
	const total = diaryData.length;
	const hasImages = diaryData.filter(
		(item) => item.images && item.images.length > 0,
	).length;
	const hasLocation = diaryData.filter((item) => item.location).length;
	const hasMood = diaryData.filter((item) => item.mood).length;

	return {
		total,
		hasImages,
		hasLocation,
		hasMood,
		imagePercentage: Math.round((hasImages / total) * 100),
		locationPercentage: Math.round((hasLocation / total) * 100),
		moodPercentage: Math.round((hasMood / total) * 100),
	};
};

// 获取日记列表（按时间倒序）
export const getDiaryList = (limit?: number) => {
	const sortedData = diaryData.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 获取最新的日记
export const getLatestDiary = () => {
	return getDiaryList(1)[0];
};

// 根据ID获取日记
export const getDiaryById = (id: number) => {
	return diaryData.find((item) => item.id === id);
};

// 获取包含图片的日记
export const getDiaryWithImages = () => {
	return diaryData.filter((item) => item.images && item.images.length > 0);
};

// 根据标签筛选日记
export const getDiaryByTag = (tag: string) => {
	return diaryData
		.filter((item) => item.tags?.includes(tag))
		.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
};

// 获取所有标签
export const getAllTags = () => {
	const tags = new Set<string>();
	diaryData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

export default diaryData;
