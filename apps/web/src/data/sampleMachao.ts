import type { ResumeContent } from '../types/resume'
import { createId, themeFromPreset, THEME_PRESETS } from '../types/resume'

const wineRose = THEME_PRESETS.find((p) => p.id === 'wine-rose')!

/** 马超（三国）示例简历，用于预览排版与导出效果 */
export function createMachaoSampleContent(): ResumeContent {
  return {
    template: 'default',
    theme: themeFromPreset(wineRose),
    sections: [
      {
        id: 'basics',
        type: 'basics',
        fields: {
          name: '马超',
          title: '征西将军 · 五虎上将',
          email: 'machao@shu-han.example',
          phone: '139-0123-4567',
          location: '陇西郡茂陵（汉中）',
          avatar: '',
        },
      },
      {
        id: 'work-1',
        type: 'work',
        items: [
          {
            id: createId(),
            company: '蜀汉',
            position: '镇西将军 · 督凉州诸军事',
            startDate: '214',
            endDate: '222',
            description: `<p>受刘备亲封为<strong>五虎上将</strong>之一，镇守汉中与凉州方向，负责西北防务与羌氐部族安抚。</p>
<ul>
<li>参与汉中之战后长期驻守阳平关一线，稳定巴蜀北境</li>
<li>以「西凉铁骑」著称，善骑兵突击与快速机动</li>
<li>协调地方豪强，维护陇右走廊交通与军粮补给</li>
</ul>`,
          },
          {
            id: createId(),
            company: '曹操集团（短暂归附）',
            position: '偏将军',
            startDate: '211',
            endDate: '211',
            description: `<p>潼关之战后曾短期归附曹操，获封偏将军，后复归刘备阵营。</p>
<p>此段经历加深了对曹魏西北军制的了解，为日后蜀汉西北防务提供参考。</p>`,
          },
          {
            id: createId(),
            company: '韩遂联军',
            position: '先锋大将',
            startDate: '208',
            endDate: '211',
            description: `<p>与韩遂等西凉诸部结盟，在关中与曹操集团对峙，参与潼关之战。</p>
<ul>
<li>率铁骑多次冲击曹军前锋，以勇猛闻名</li>
<li>善于夜袭与平原骑兵会战</li>
</ul>`,
          },
        ],
      },
      {
        id: 'edu-1',
        type: 'education',
        items: [
          {
            id: createId(),
            school: '西凉马家武塾',
            degree: '骑射 · 枪法 · 兵法启蒙',
            startDate: '198',
            endDate: '207',
          },
          {
            id: createId(),
            school: '陇西郡学宫（旁听）',
            degree: '经史与军律概要',
            startDate: '205',
            endDate: '207',
          },
        ],
      },
      {
        id: 'cert-1',
        type: 'certificates',
        items: [
          { id: createId(), name: '五虎上将（蜀汉册封）' },
          { id: createId(), name: '斄乡侯' },
          { id: createId(), name: '潼关之战先锋战功记' },
          { id: createId(), name: '西凉铁骑统领资格' },
        ],
      },
      {
        id: createId(),
        type: 'custom',
        title: '军事特长',
        items: [
          {
            id: createId(),
            content: `<p><strong>擅长领域：</strong>骑兵突击、平原会战、快速奔袭、夜袭骚扰</p>
<p><strong>代表战法：</strong>铁骑冲锋、侧翼包抄、断粮道牵制</p>
<p><strong>个人特点：</strong>勇冠三军，性刚烈，重诺尚义；与蜀汉核心团队配合默契，深得士卒拥戴。</p>`,
          },
        ],
      },
    ],
  }
}

export const MACHAO_SAMPLE_TITLE = '马超 - 个人简历'
