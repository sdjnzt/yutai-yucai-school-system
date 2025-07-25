import React, { useState, useMemo } from 'react';
import {
  Card,
  Select,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  Space,
  Alert,
  Typography,
  Table,
  Tooltip,
  Badge,
  Tabs,
  Button,
  Modal
} from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  LineChartOutlined,
  BarChartOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 学科配置
const subjectConfig = {
  语文: { 
    min: 70, max: 130, excellent: 110, good: 90, pass: 80,
    ranges: ['120-130', '110-119', '100-109', '90-99', '80-89', '70-79', '0-69']
  },
  数学: { 
    min: 70, max: 150, excellent: 130, good: 110, pass: 90,
    ranges: ['140-150', '130-139', '120-129', '110-119', '100-109', '90-99', '0-89']
  },
  英语: { 
    min: 70, max: 150, excellent: 130, good: 110, pass: 90,
    ranges: ['140-150', '130-139', '120-129', '110-119', '100-109', '90-99', '0-89']
  },
  物理: { 
    min: 50, max: 100, excellent: 85, good: 70, pass: 60,
    ranges: ['90-100', '80-89', '70-79', '60-69', '0-59']
  },
  化学: { 
    min: 50, max: 100, excellent: 85, good: 70, pass: 60,
    ranges: ['90-100', '80-89', '70-79', '60-69', '0-59']
  },
  生物: { 
    min: 50, max: 100, excellent: 85, good: 70, pass: 60,
    ranges: ['90-100', '80-89', '70-79', '60-69', '0-59']
  },
  政治: { 
    min: 50, max: 100, excellent: 85, good: 70, pass: 60,
    ranges: ['90-100', '80-89', '70-79', '60-69', '0-59']
  },
  历史: { 
    min: 50, max: 100, excellent: 85, good: 70, pass: 60,
    ranges: ['90-100', '80-89', '70-79', '60-69', '0-59']
  },
  地理: { 
    min: 50, max: 100, excellent: 85, good: 70, pass: 60,
    ranges: ['90-100', '80-89', '70-79', '60-69', '0-59']
  }
};

const ScoreAnalysis = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // 生成班级数据
  const classes = [
    { id: 'G1C1', name: '高一(1)班', type: '文科' },
    { id: 'G1C2', name: '高一(2)班', type: '文科' },
    { id: 'G1C3', name: '高一(3)班', type: '文科' },
    { id: 'G1C4', name: '高一(4)班', type: '文科' },
    { id: 'G1C5', name: '高一(5)班', type: '理科' },
    { id: 'G1C6', name: '高一(6)班', type: '理科' },
    { id: 'G1C7', name: '高一(7)班', type: '理科' },
    { id: 'G1C8', name: '高一(8)班', type: '理科' },
  ];

  // 生成考试数据
  const exams = [
    { id: '202507M', name: '2025年7月月考', type: '月考' },
    { id: '202506F', name: '2025年期末考试', type: '期末' },
    { id: '202504M', name: '2025年4月月考', type: '月考' },
    { id: '202503M', name: '2025年3月月考', type: '月考' },
    { id: '202501F', name: '2025年期中考试', type: '期中' },
  ];

  // 生成成绩趋势数据
  const generateTrendData = () => {
    if (!selectedClass || !selectedSubject) return [];

    const config = subjectConfig[selectedSubject];
    const classType = classes.find(c => c.id === selectedClass)?.type;

    // 根据班级类型调整分数
    const adjustScoreByClassType = (score, subject) => {
      if (classType === '理科' && ['物理', '化学', '生物', '数学'].includes(subject)) {
        return score + Math.floor(Math.random() * 5); // 理科班理科成绩略高
      }
      if (classType === '文科' && ['政治', '历史', '地理', '语文'].includes(subject)) {
        return score + Math.floor(Math.random() * 5); // 文科班文科成绩略高
      }
      return score;
    };

    return exams.map(exam => {
      // 基础分设置
      let baseScore = config.pass + Math.floor(Math.random() * (config.good - config.pass));
      
      // 根据考试类型调整分数
      if (exam.type === '期末' || exam.type === '期中') {
        baseScore = baseScore - 5; // 大考难度较大，分数略低
      }

      // 生成班级平均分
      const classAvg = adjustScoreByClassType(
        baseScore + Math.floor(Math.random() * 10) - 5,
        selectedSubject
      );

      // 生成年级平均分（略低于班级平均分）
      const gradeAvg = classAvg - Math.floor(Math.random() * 3);

      // 生成最高分
      const maxScore = Math.min(
        adjustScoreByClassType(
          classAvg + 15 + Math.floor(Math.random() * 10),
          selectedSubject
        ),
        config.max
      );

      // 生成最低分
      const minScore = Math.max(
        classAvg - 20 - Math.floor(Math.random() * 10),
        config.min
      );

      return {
        examName: exam.name,
        classAvg: Number(classAvg.toFixed(1)),
        gradeAvg: Number(gradeAvg.toFixed(1)),
        maxScore: Number(maxScore.toFixed(1)),
        minScore: Number(minScore.toFixed(1)),
        type: exam.type
      };
    }).reverse();
  };

  // 生成分数段分布数据
  const generateDistributionData = () => {
    if (!selectedClass || !selectedSubject) return [];

    const ranges = subjectConfig[selectedSubject].ranges;
    const total = 50; // 班级总人数
    const classType = classes.find(c => c.id === selectedClass)?.type;
    
    // 根据班级类型和学科调整分布
    const getDistribution = () => {
      const isMatchingType = (classType === '理科' && ['物理', '化学', '生物', '数学'].includes(selectedSubject)) ||
                            (classType === '文科' && ['政治', '历史', '地理', '语文'].includes(selectedSubject));

      if (['语文', '数学', '英语'].includes(selectedSubject)) {
        // 主科分布
        return ranges.map((range, index) => ({
          range: range + '分',
          count: index === 0 ? Math.floor(Math.random() * 3) + 2 : // 顶尖分数 2-5人
                 index === 1 ? Math.floor(Math.random() * 4) + 4 : // 优秀分数 4-8人
                 index === 2 ? Math.floor(Math.random() * 5) + 8 : // 良好分数 8-13人
                 index === 3 ? Math.floor(Math.random() * 5) + 10 : // 中等分数 10-15人
                 index === 4 ? Math.floor(Math.random() * 4) + 8 : // 及格分数 8-12人
                 index === ranges.length - 1 ? 0 : Math.floor(Math.random() * 3) + 2 // 不及格 2-5人
        }));
      } else if (isMatchingType) {
        // 对口学科分布（理科班理科/文科班文科）
        return ranges.map((range, index) => ({
          range: range + '分',
          count: index === 0 ? Math.floor(Math.random() * 4) + 3 : // 优秀 3-7人
                 index === 1 ? Math.floor(Math.random() * 5) + 8 : // 良好 8-13人
                 index === 2 ? Math.floor(Math.random() * 5) + 12 : // 中等 12-17人
                 index === 3 ? Math.floor(Math.random() * 4) + 8 : // 及格 8-12人
                 Math.floor(Math.random() * 3) + 2 // 不及格 2-5人
        }));
      } else {
        // 非对口学科分布
        return ranges.map((range, index) => ({
          range: range + '分',
          count: index === 0 ? Math.floor(Math.random() * 2) + 1 : // 优秀 1-3人
                 index === 1 ? Math.floor(Math.random() * 3) + 5 : // 良好 5-8人
                 index === 2 ? Math.floor(Math.random() * 5) + 10 : // 中等 10-15人
                 index === 3 ? Math.floor(Math.random() * 5) + 12 : // 及格 12-17人
                 Math.floor(Math.random() * 4) + 4 // 不及格 4-8人
        }));
      }
    };

    const distribution = getDistribution();
    
    // 调整总人数为50
    const currentTotal = distribution.reduce((sum, item) => sum + item.count, 0);
    const diff = total - currentTotal;
    if (diff !== 0) {
      // 将差值加到中间分数段
      const middleIndex = Math.floor(distribution.length / 2);
      distribution[middleIndex].count += diff;
    }

    return distribution;
  };

  // 生成学生排名数据
  const generateRankingData = () => {
    if (!selectedClass || !selectedSubject) return [];

    const config = subjectConfig[selectedSubject];
    const classType = classes.find(c => c.id === selectedClass)?.type;
    const isMatchingType = (classType === '理科' && ['物理', '化学', '生物', '数学'].includes(selectedSubject)) ||
                          (classType === '文科' && ['政治', '历史', '地理', '语文'].includes(selectedSubject));

    // 计算班级在年级中的大致位置（1-10，共10个班）
    const classPosition = (() => {
      const classNumber = parseInt(selectedClass.match(/\d+/)[0]);
      if (classType === '理科') {
        // 理科班（5-8班）的排名区间
        return classNumber <= 6 ? 1 : // 理科重点班
               classNumber <= 7 ? 3 : // 理科普通班
               5; // 理科普通班
      } else {
        // 文科班（1-4班）的排名区间
        return classNumber <= 2 ? 2 : // 文科重点班
               classNumber <= 3 ? 4 : // 文科普通班
               6; // 文科普通班
      }
    })();

    const rankings = [];
    for (let i = 1; i <= 50; i++) {
      // 基于排名计算基础分
      const rankPercent = i / 50;
      let baseScore;
      
      if (rankPercent <= 0.1) { // 前10%
        baseScore = config.excellent + Math.floor(Math.random() * (config.max - config.excellent));
      } else if (rankPercent <= 0.3) { // 前30%
        baseScore = config.good + Math.floor(Math.random() * (config.excellent - config.good));
      } else if (rankPercent <= 0.7) { // 前70%
        baseScore = config.pass + Math.floor(Math.random() * (config.good - config.pass));
      } else { // 后30%
        baseScore = config.min + Math.floor(Math.random() * (config.pass - config.min));
      }

      // 根据班级类型调整分数
      if (isMatchingType) {
        baseScore += Math.floor(Math.random() * 5); // 对口学科分数略高
      }

      // 生成当前分数和上次分数
      const currentScore = Math.min(Math.max(baseScore + Math.floor(Math.random() * 10) - 5, config.min), config.max);
      const lastScore = Math.min(Math.max(currentScore + Math.floor(Math.random() * 10) - 5, config.min), config.max);
      
      // 计算年级排名
      let gradeRank;
      const totalStudents = 500; // 年级总人数（10个班，每班50人）

      if (isMatchingType) {
        // 对口学科排名计算
        if (classPosition <= 2) { // 重点班
          // 重点班学生在对口学科排名相对靠前
          if (rankPercent <= 0.2) { // 班级前20%
            gradeRank = Math.max(1, Math.floor(i * 1.5) + Math.floor(Math.random() * 10));
          } else if (rankPercent <= 0.6) { // 班级前60%
            gradeRank = Math.max(1, Math.floor(i * 2) + Math.floor(Math.random() * 20));
          } else { // 班级后40%
            gradeRank = Math.min(totalStudents, Math.floor(i * 3) + Math.floor(Math.random() * 30));
          }
        } else if (classPosition <= 4) { // 中等班
          // 中等班学生在对口学科排名分布较均匀
          if (rankPercent <= 0.3) { // 班级前30%
            gradeRank = Math.max(50, Math.floor(i * 2.5) + Math.floor(Math.random() * 20));
          } else if (rankPercent <= 0.7) { // 班级中间40%
            gradeRank = Math.min(totalStudents, Math.floor(i * 3) + Math.floor(Math.random() * 30));
          } else { // 班级后30%
            gradeRank = Math.min(totalStudents, Math.floor(i * 4) + Math.floor(Math.random() * 40));
          }
        } else { // 普通班
          // 普通班学生在对口学科排名相对靠后
          if (rankPercent <= 0.2) { // 班级前20%
            gradeRank = Math.max(100, Math.floor(i * 3) + Math.floor(Math.random() * 30));
          } else {
            gradeRank = Math.min(totalStudents, Math.floor(i * 5) + Math.floor(Math.random() * 50));
          }
        }
      } else {
        // 非对口学科排名计算
        if (classPosition <= 2) { // 重点班
          // 重点班在非对口学科也保持一定优势
          if (rankPercent <= 0.3) { // 班级前30%
            gradeRank = Math.max(50, Math.floor(i * 2) + Math.floor(Math.random() * 30));
          } else {
            gradeRank = Math.min(totalStudents, Math.floor(i * 4) + Math.floor(Math.random() * 50));
          }
        } else if (classPosition <= 4) { // 中等班
          // 中等班在非对口学科排名较分散
          if (rankPercent <= 0.2) { // 班级前20%
            gradeRank = Math.max(100, Math.floor(i * 3) + Math.floor(Math.random() * 40));
          } else {
            gradeRank = Math.min(totalStudents, Math.floor(i * 5) + Math.floor(Math.random() * 60));
          }
        } else { // 普通班
          // 普通班在非对口学科排名靠后
          gradeRank = Math.min(totalStudents, Math.floor(i * 6) + Math.floor(Math.random() * 70));
        }
      }

      // 处理特殊情况：主科（语文、数学、英语）
      if (['语文', '数学', '英语'].includes(selectedSubject)) {
        // 主科排名相对更均匀，但仍保持班级差异
        gradeRank = Math.max(1, Math.min(totalStudents,
          Math.floor(gradeRank * 0.8) + // 基础排名
          Math.floor(Math.random() * 30) - 15 + // 随机浮动
          (classPosition - 1) * 10 // 班级影响
        ));
      }

      rankings.push({
        key: i,
        rank: i,
        name: generateStudentName(),
        currentScore,
        lastScore,
        gradeRank,
        trend: currentScore - lastScore
      });
    }

    return rankings;
  };

  // 生成学生姓名
  const generateStudentName = () => {
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
    const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军'];
    return surnames[Math.floor(Math.random() * surnames.length)] + 
           names[Math.floor(Math.random() * names.length)];
  };

  // 处理班级选择
  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  // 处理学科选择
  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
  };

  // 计算统计数据
  const statistics = useMemo(() => {
    if (!selectedClass || !selectedSubject) return null;

    const trendData = generateTrendData();
    const latestExam = trendData[trendData.length - 1];
    const previousExam = trendData[trendData.length - 2];
    
    const classAvgTrend = latestExam.classAvg - previousExam.classAvg;
    const gradeAvgTrend = latestExam.gradeAvg - previousExam.gradeAvg;

    // 计算优良率
    const calculateRates = () => {
      const distributionData = generateDistributionData();
      const totalStudents = distributionData.reduce((sum, item) => sum + item.count, 0);
      
      // 根据不同学科的分数段计算优良率
      let excellentCount = 0;
      let goodCount = 0;

      if (['语文', '数学', '英语'].includes(selectedSubject)) {
        // 主科（语文、数学、英语）
        distributionData.forEach(item => {
          const range = item.range.replace('分', '');
          const [min] = range.split('-').map(Number);
          if (selectedSubject === '语文') {
            if (min >= 110) excellentCount += item.count; // 优秀：110分以上
            else if (min >= 90) goodCount += item.count;  // 良好：90-109分
          } else {
            // 数学、英语
            if (min >= 130) excellentCount += item.count; // 优秀：130分以上
            else if (min >= 110) goodCount += item.count; // 良好：110-129分
          }
        });
      } else {
        // 其他学科（满分100分）
        distributionData.forEach(item => {
          const range = item.range.replace('分', '');
          const [min] = range.split('-').map(Number);
          if (min >= 85) excellentCount += item.count;    // 优秀：85分以上
          else if (min >= 70) goodCount += item.count;    // 良好：70-84分
        });
      }

      const excellentRate = (excellentCount / totalStudents * 100).toFixed(1);
      const goodRate = (goodCount / totalStudents * 100).toFixed(1);
      const excellentAndGoodRate = ((excellentCount + goodCount) / totalStudents * 100).toFixed(1);

      return {
        excellentRate,
        goodRate,
        excellentAndGoodRate
      };
    };

    const rates = calculateRates();

    return {
      classAvg: latestExam.classAvg,
      gradeAvg: latestExam.gradeAvg,
      maxScore: latestExam.maxScore,
      minScore: latestExam.minScore,
      classAvgTrend,
      gradeAvgTrend,
      ...rates
    };
  }, [selectedClass, selectedSubject]);

  // 生成随机分数
  const getRandomScore = (subject, studentLevel) => {
    const config = subjectConfig[subject];
    let baseScore;
    
    if (studentLevel === 'excellent') {
      baseScore = config.excellent + Math.floor(Math.random() * (config.max - config.excellent));
    } else if (studentLevel === 'good') {
      baseScore = config.good + Math.floor(Math.random() * (config.excellent - config.good));
    } else {
      baseScore = config.pass + Math.floor(Math.random() * (config.good - config.pass));
    }
    
    return Math.min(Math.max(baseScore + Math.floor(Math.random() * 10) - 5, config.min), config.max);
  };

  // 生成年级总成绩数据
  const generateGradeScoreData = () => {
    const totalClasses = 10; // 年级共10个班
    const studentsPerClass = 50; // 每班50人
    const allStudents = [];

    // 生成所有班级的学生成绩
    for (let classNum = 1; classNum <= totalClasses; classNum++) {
      const isCurrentClass = `G1C${classNum}` === selectedClass;
      const classType = classNum <= 4 ? '文科' : '理科';
      
      for (let i = 1; i <= studentsPerClass; i++) {
        // 根据班级类型和排名调整学生水平
        let studentLevel;
        if (classNum <= 2 || (classNum >= 5 && classNum <= 6)) {
          // 重点班
          studentLevel = i <= 10 ? 'excellent' : i <= 30 ? 'good' : 'normal';
        } else if (classNum === 3 || classNum === 7) {
          // 中等班
          studentLevel = i <= 5 ? 'excellent' : i <= 20 ? 'good' : 'normal';
        } else {
          // 普通班
          studentLevel = i <= 3 ? 'excellent' : i <= 15 ? 'good' : 'normal';
        }

        const scores = {};
        let totalScore = 0;

        // 计算主科成绩
        ['语文', '数学', '英语'].forEach(subject => {
          const score = getRandomScore(subject, studentLevel);
          scores[subject] = score;
          totalScore += score;
        });

        // 计算选修科目成绩
        if (classType === '理科') {
          ['物理', '化学', '生物'].forEach(subject => {
            const score = getRandomScore(subject, studentLevel);
            scores[subject] = score;
            totalScore += score;
          });
        } else {
          ['政治', '历史', '地理'].forEach(subject => {
            const score = getRandomScore(subject, studentLevel);
            scores[subject] = score;
            totalScore += score;
          });
        }

        allStudents.push({
          key: `C${classNum}-${i}`,
          classNum: `高一(${classNum})班`,
          classType,
          isCurrentClass,
          name: generateStudentName(),
          totalScore,
          avgScore: (totalScore / 6).toFixed(1),
          ...scores
        });
      }
    }

    // 按总分排序并添加年级排名
    return allStudents
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((student, index) => ({
        ...student,
        gradeRank: index + 1
      }));
  };

  // 生成总分排名数据
  const generateTotalScoreData = () => {
    if (!selectedClass) return [];

    // 获取年级所有学生数据（已包含年级排名）
    const gradeData = generateGradeScoreData();
    
    // 获取当前班级的学生数据并添加班级排名
    return gradeData
      .filter(s => s.isCurrentClass)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((student, index) => ({
        ...student,
        rank: index + 1,  // 班级排名
      }));
  };

  // 计算年级排名统计数据
  const gradeRankStatistics = useMemo(() => {
    if (!selectedClass) return null;

    const gradeData = generateGradeScoreData();
    const currentClassStudents = gradeData.filter(s => s.isCurrentClass);

    // 计算本班在年级的排名分布
    const rankRanges = [
      { range: '1-10名', count: 0 },
      { range: '11-50名', count: 0 },
      { range: '51-100名', count: 0 },
      { range: '101-200名', count: 0 },
      { range: '201-300名', count: 0 },
      { range: '301-400名', count: 0 },
      { range: '401-500名', count: 0 }
    ];

    currentClassStudents.forEach(student => {
      const rank = student.gradeRank;
      if (rank <= 10) rankRanges[0].count++;
      else if (rank <= 50) rankRanges[1].count++;
      else if (rank <= 100) rankRanges[2].count++;
      else if (rank <= 200) rankRanges[3].count++;
      else if (rank <= 300) rankRanges[4].count++;
      else if (rank <= 400) rankRanges[5].count++;
      else rankRanges[6].count++;
    });

    // 计算本班年级排名的统计指标
    const ranks = currentClassStudents.map(s => s.gradeRank);
    const bestRank = Math.min(...ranks);
    const worstRank = Math.max(...ranks);
    const averageRank = Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length);
    const top100Count = ranks.filter(r => r <= 100).length;

    return {
      rankRanges,
      bestRank,
      worstRank,
      averageRank,
      top100Rate: (top100Count / 50 * 100).toFixed(1) // 前100名比例
    };
  }, [selectedClass]);

  // 总分排名表格列配置
  const totalScoreColumns = [
    {
      title: '班级排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      fixed: 'left',
      render: (rank) => (
        <Tag color={
          rank <= 3 ? 'gold' :
          rank <= 10 ? 'blue' :
          'default'
        }>
          第 {rank} 名
        </Tag>
      ),
    },
    {
      title: '年级排名',
      dataIndex: 'gradeRank',
      key: 'gradeRank',
      width: 80,
      fixed: 'left',
      render: (rank) => (
        <Tag color="purple">
          第 {rank} 名
        </Tag>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 100,
      sorter: (a, b) => a.totalScore - b.totalScore,
      render: (score) => (
        <Text strong style={{ color: score >= 500 ? '#52c41a' : score >= 400 ? '#1890ff' : '#f5222d' }}>
          {score}
        </Text>
      ),
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      width: 100,
    },
    {
      title: '语文',
      dataIndex: '语文',
      key: '语文',
      width: 100,
      render: (score) => (
        <span style={{ color: score >= 110 ? '#52c41a' : score >= 90 ? '#1890ff' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '数学',
      dataIndex: '数学',
      key: '数学',
      width: 100,
      render: (score) => (
        <span style={{ color: score >= 130 ? '#52c41a' : score >= 110 ? '#1890ff' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '英语',
      dataIndex: '英语',
      key: '英语',
      width: 100,
      render: (score) => (
        <span style={{ color: score >= 130 ? '#52c41a' : score >= 110 ? '#1890ff' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    ...(classes.find(c => c.id === selectedClass)?.type === '理科' ? [
      {
        title: '物理',
        dataIndex: '物理',
        key: '物理',
        width: 100,
        render: (score) => (
          <span style={{ color: score >= 85 ? '#52c41a' : score >= 70 ? '#1890ff' : '#f5222d' }}>
            {score}
          </span>
        ),
      },
      {
        title: '化学',
        dataIndex: '化学',
        key: '化学',
        width: 100,
        render: (score) => (
          <span style={{ color: score >= 85 ? '#52c41a' : score >= 70 ? '#1890ff' : '#f5222d' }}>
            {score}
          </span>
        ),
      },
      {
        title: '生物',
        dataIndex: '生物',
        key: '生物',
        width: 100,
        render: (score) => (
          <span style={{ color: score >= 85 ? '#52c41a' : score >= 70 ? '#1890ff' : '#f5222d' }}>
            {score}
          </span>
        ),
      },
    ] : [
      {
        title: '政治',
        dataIndex: '政治',
        key: '政治',
        width: 100,
        render: (score) => (
          <span style={{ color: score >= 85 ? '#52c41a' : score >= 70 ? '#1890ff' : '#f5222d' }}>
            {score}
          </span>
        ),
      },
      {
        title: '历史',
        dataIndex: '历史',
        key: '历史',
        width: 100,
        render: (score) => (
          <span style={{ color: score >= 85 ? '#52c41a' : score >= 70 ? '#1890ff' : '#f5222d' }}>
            {score}
          </span>
        ),
      },
      {
        title: '地理',
        dataIndex: '地理',
        key: '地理',
        width: 100,
        render: (score) => (
          <span style={{ color: score >= 85 ? '#52c41a' : score >= 70 ? '#1890ff' : '#f5222d' }}>
            {score}
          </span>
        ),
      },
    ]),
  ];

  // 计算总成绩统计数据
  const totalScoreStatistics = useMemo(() => {
    if (!selectedClass) return null;

    const data = generateTotalScoreData();
    const classType = classes.find(c => c.id === selectedClass)?.type;
    const totalMax = classType === '理科' ? 750 : 750; // 三门主科各150分，三门副科各100分

    const totalScores = data.map(student => student.totalScore);
    const avgScore = (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(1);
    const maxScore = Math.max(...totalScores);
    const minScore = Math.min(...totalScores);

    const excellentCount = totalScores.filter(score => score >= totalMax * 0.85).length;
    const goodCount = totalScores.filter(score => score >= totalMax * 0.70 && score < totalMax * 0.85).length;
    
    return {
      avgScore,
      maxScore,
      minScore,
      excellentRate: (excellentCount / totalScores.length * 100).toFixed(1),
      goodRate: (goodCount / totalScores.length * 100).toFixed(1),
      excellentAndGoodRate: ((excellentCount + goodCount) / totalScores.length * 100).toFixed(1)
    };
  }, [selectedClass]);

  // 排名表格列配置
  const rankColumns = [
    {
      title: '班级排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      fixed: 'left',
      render: (rank) => <Tag color="blue">第 {rank} 名</Tag>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
    },
    {
      title: '当前分数',
      dataIndex: 'currentScore',
      key: 'currentScore',
      width: 100,
      render: (score) => (
        <span style={{ color: score >= 60 ? '#52c41a' : '#f5222d' }}>
          {score}
        </span>
      ),
    },
    {
      title: '上次分数',
      dataIndex: 'lastScore',
      key: 'lastScore',
      width: 100,
    },
    {
      title: '分数趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 100,
      render: (trend) => (
        <Space>
          {trend > 0 ? (
            <Tag color="success" icon={<RiseOutlined />}>+{trend}</Tag>
          ) : trend < 0 ? (
            <Tag color="error" icon={<FallOutlined />}>{trend}</Tag>
          ) : (
            <Tag>0</Tag>
          )}
        </Space>
      ),
    },
    {
      title: '年级排名',
      dataIndex: 'gradeRank',
      key: 'gradeRank',
      width: 100,
      render: (rank) => <Tag>第 {rank} 名</Tag>,
    },
  ];

  // 顶部控制栏
  const [activeTab, setActiveTab] = useState('single');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      {/* 顶部控制栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Select
              placeholder="请选择班级"
              style={{ width: '100%' }}
              onChange={handleClassChange}
              value={selectedClass}
            >
              {classes.map(cls => (
                <Select.Option key={cls.id} value={cls.id}>
                  {cls.name}
                  <Tag color={cls.type === '文科' ? 'blue' : 'green'} style={{ marginLeft: 8 }}>
                    {cls.type}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </Col>
          {activeTab !== 'total' && (
            <Col span={8}>
              <Select
                placeholder="请选择学科"
                style={{ width: '100%' }}
                onChange={handleSubjectChange}
                value={selectedSubject}
              >
                <Select.OptGroup label="文科">
                  <Select.Option value="语文">语文</Select.Option>
                  <Select.Option value="英语">英语</Select.Option>
                  <Select.Option value="政治">政治</Select.Option>
                  <Select.Option value="历史">历史</Select.Option>
                  <Select.Option value="地理">地理</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label="理科">
                  <Select.Option value="数学">数学</Select.Option>
                  <Select.Option value="物理">物理</Select.Option>
                  <Select.Option value="化学">化学</Select.Option>
                  <Select.Option value="生物">生物</Select.Option>
                </Select.OptGroup>
              </Select>
            </Col>
          )}
        </Row>
      </Card>

      {!selectedClass || (!selectedSubject && activeTab !== 'total') ? (
        <Alert
          message={`请选择${activeTab === 'total' ? '班级' : '班级和学科'}`}
          description={`请先选择要分析的${activeTab === 'total' ? '班级' : '班级和学科'}`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : (
        <>
          <Tabs defaultActiveKey="single" onChange={handleTabChange} style={{ marginBottom: 16 }}>
            <TabPane tab="单科分析" key="single">
              {/* 原有的单科分析内容 */}
              {statistics && (
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="班级平均分"
                        value={statistics.classAvg}
                        suffix="分"
                        prefix={<LineChartOutlined />}
                      />
                      <Divider style={{ margin: '12px 0' }} />
                      <Space>
                        {statistics.classAvgTrend > 0 ? (
                          <Tag color="success" icon={<RiseOutlined />}>
                            较上次提升 {statistics.classAvgTrend.toFixed(1)} 分
                          </Tag>
                        ) : (
                          <Tag color="error" icon={<FallOutlined />}>
                            较上次下降 {Math.abs(statistics.classAvgTrend).toFixed(1)} 分
                          </Tag>
                        )}
                      </Space>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="年级平均分"
                        value={statistics.gradeAvg}
                        suffix="分"
                        prefix={<BarChartOutlined />}
                      />
                      <Divider style={{ margin: '12px 0' }} />
                      <Space>
                        {statistics.gradeAvgTrend > 0 ? (
                          <Tag color="success" icon={<RiseOutlined />}>
                            较上次提升 {statistics.gradeAvgTrend.toFixed(1)} 分
                          </Tag>
                        ) : (
                          <Tag color="error" icon={<FallOutlined />}>
                            较上次下降 {Math.abs(statistics.gradeAvgTrend).toFixed(1)} 分
                          </Tag>
                        )}
                      </Space>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="最高分"
                        value={statistics.maxScore}
                        suffix="分"
                        prefix={<TrophyOutlined />}
                      />
                      <Divider style={{ margin: '12px 0' }} />
                      <div>最低分：{statistics.minScore}分</div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="优良率"
                        value={statistics.excellentAndGoodRate}
                        suffix="%"
                        prefix={<TeamOutlined />}
                      />
                      <Divider style={{ margin: '12px 0' }} />
                      <Space split={<Divider type="vertical" />} style={{ width: '100%', justifyContent: 'space-around' }}>
                        <Text type="secondary">优秀率：{statistics.excellentRate}%</Text>
                        <Text type="secondary">良好率：{statistics.goodRate}%</Text>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* 成绩趋势图 */}
              <Card title="成绩趋势分析" style={{ marginBottom: 16 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateTrendData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="examName" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="classAvg"
                      name="班级平均分"
                      stroke="#1890ff"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="gradeAvg"
                      name="年级平均分"
                      stroke="#52c41a"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="maxScore"
                      name="最高分"
                      stroke="#faad14"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="minScore"
                      name="最低分"
                      stroke="#ff4d4f"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* 分数段分布图 */}
              <Card title="分数段分布" style={{ marginBottom: 16 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateDistributionData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar
                      dataKey="count"
                      name="人数"
                      fill="#1890ff"
                      label={{ position: 'top' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* 学生排名表 */}
              <Card title="学生成绩排名">
                <Table
                  columns={rankColumns}
                  dataSource={generateRankingData()}
                  scroll={{ x: 800 }}
                  pagination={{
                    pageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 名学生`,
                  }}
                />
              </Card>
            </TabPane>
            
            <TabPane tab="总成绩分析" key="total">
              {totalScoreStatistics && (
                <>
                  {/* 原有的统计卡片 */}
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="班级总分平均"
                          value={totalScoreStatistics.avgScore}
                          suffix="分"
                          prefix={<LineChartOutlined />}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <Space>
                          <Tag color="blue">满分：750分</Tag>
                        </Space>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="最高总分"
                          value={totalScoreStatistics.maxScore}
                          suffix="分"
                          prefix={<TrophyOutlined />}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <div>最低总分：{totalScoreStatistics.minScore}分</div>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="总分优良率"
                          value={totalScoreStatistics.excellentAndGoodRate}
                          suffix="%"
                          prefix={<TeamOutlined />}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <Space split={<Divider type="vertical" />} style={{ width: '100%', justifyContent: 'space-around' }}>
                          <Text type="secondary">优秀率：{totalScoreStatistics.excellentRate}%</Text>
                          <Text type="secondary">良好率：{totalScoreStatistics.goodRate}%</Text>
                        </Space>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card>
                        <Statistic
                          title="总分分差"
                          value={totalScoreStatistics.maxScore - totalScoreStatistics.minScore}
                          suffix="分"
                          prefix={<BarChartOutlined />}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <div>平均分差：{(totalScoreStatistics.maxScore - totalScoreStatistics.avgScore).toFixed(1)}分</div>
                      </Card>
                    </Col>
                  </Row>

                  {/* 年级排名统计卡片 */}
                  <Card title="年级排名分析" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Card>
                          <Statistic
                            title="最好名次"
                            value={gradeRankStatistics.bestRank}
                            suffix="名"
                            prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                          />
                          <Divider style={{ margin: '12px 0' }} />
                          <div>最差名次：{gradeRankStatistics.worstRank}名</div>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card>
                          <Statistic
                            title="平均名次"
                            value={gradeRankStatistics.averageRank}
                            suffix="名"
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                          />
                          <Divider style={{ margin: '12px 0' }} />
                          <div>年级总人数：500名</div>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card>
                          <Statistic
                            title="前100名人数"
                            value={gradeRankStatistics.top100Rate}
                            suffix="%"
                            prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                          />
                          <Divider style={{ margin: '12px 0' }} />
                          <div>班级人数：50名</div>
                        </Card>
                      </Col>
                      <Col span={6}>
                        <Card>
                          <Statistic
                            title="名次分差"
                            value={gradeRankStatistics.worstRank - gradeRankStatistics.bestRank}
                            suffix="名"
                            prefix={<BarChartOutlined style={{ color: '#722ed1' }} />}
                          />
                          <Divider style={{ margin: '12px 0' }} />
                          <div>平均分差：{gradeRankStatistics.worstRank - gradeRankStatistics.averageRank}名</div>
                        </Card>
                      </Col>
                    </Row>

                    {/* 年级排名分布图 */}
                    <div style={{ marginTop: 16 }}>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gradeRankStatistics.rankRanges} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar
                            dataKey="count"
                            name="人数"
                            fill="#1890ff"
                            label={{ position: 'top' }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* 总分排名表 */}
                  <Card title="总分排名表">
                    <Table
                      columns={totalScoreColumns}
                      dataSource={generateTotalScoreData()}
                      scroll={{ x: 1300 }}
                      pagination={{
                        pageSize: 10,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 名学生`,
                      }}
                    />
                  </Card>
                </>
              )}
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ScoreAnalysis; 