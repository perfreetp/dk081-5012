import type { CampusRule } from "@/types"

export const CAMPUSES = [
  { id: "east", name: "东校区" },
  { id: "south", name: "南校区" },
  { id: "north", name: "北校区" },
]

export const BUILDINGS: Record<string, string[]> = {
  east: ["东1号楼", "东2号楼", "东3号楼", "东4号楼", "东5号楼", "东6号楼"],
  south: ["南1号楼", "南2号楼", "南3号楼", "南4号楼", "南5号楼", "南7号楼", "南8号楼"],
  north: ["北1号楼", "北2号楼", "北3号楼", "北5号楼", "北6号楼"],
}

export const CAMPUS_RULES: CampusRule[] = [
  {
    id: "r1",
    campus: "东校区",
    building: "东1号楼",
    moveTimeLimit: "工作日 8:00-18:00，周末 9:00-16:00",
    truckAccessTime: "仅南门通行，7:00-9:00 / 17:00-19:00 禁行",
    gateRegistration: "需提前1天在宿管处登记，携带学生证",
    notes: "电梯仅载货使用，需与宿管预约时段",
  },
  {
    id: "r2",
    campus: "东校区",
    building: "东2号楼",
    moveTimeLimit: "工作日 8:00-18:00，周末禁止搬运",
    truckAccessTime: "南门通行，全天可用",
    gateRegistration: "当天在门岗登记即可",
    notes: "无电梯，6楼以上建议请专业搬运",
  },
  {
    id: "r3",
    campus: "东校区",
    building: "东3号楼",
    moveTimeLimit: "每日 7:00-20:00",
    truckAccessTime: "南门/东门均可，全天通行",
    gateRegistration: "需提前1天在宿管处登记",
    notes: "有货梯，大件优先使用货梯",
  },
  {
    id: "r4",
    campus: "南校区",
    building: "南1号楼",
    moveTimeLimit: "工作日 8:00-17:00",
    truckAccessTime: "仅西门通行，9:00-16:00",
    gateRegistration: "需提前2天在后勤处申请通行证",
    notes: "毕业季可申请临时通行证，有效期3天",
  },
  {
    id: "r5",
    campus: "南校区",
    building: "南2号楼",
    moveTimeLimit: "工作日 8:00-18:00，周末 10:00-16:00",
    truckAccessTime: "西门通行，8:00-18:00",
    gateRegistration: "当天在门岗登记，出示学生证",
    notes: "楼道较窄，大件家具需拆卸后搬运",
  },
  {
    id: "r6",
    campus: "南校区",
    building: "南3号楼",
    moveTimeLimit: "每日 8:00-20:00",
    truckAccessTime: "西门/北门均可，全天通行",
    gateRegistration: "当天门岗登记",
    notes: "研究生楼，管理较宽松",
  },
  {
    id: "r7",
    campus: "北校区",
    building: "北1号楼",
    moveTimeLimit: "工作日 7:30-18:00，周末 9:00-17:00",
    truckAccessTime: "仅北门通行，8:00-17:00",
    gateRegistration: "需提前1天在宿管处登记，申请出入证",
    notes: "老楼无电梯，5楼以上搬运需特别安排",
  },
  {
    id: "r8",
    campus: "北校区",
    building: "北2号楼",
    moveTimeLimit: "工作日 8:00-18:00",
    truckAccessTime: "北门通行，7:00-19:00",
    gateRegistration: "当天门岗登记即可",
    notes: "新楼有电梯，大件可直接搬运",
  },
  {
    id: "r9",
    campus: "北校区",
    building: "北3号楼",
    moveTimeLimit: "每日 7:00-21:00",
    truckAccessTime: "北门/东门均可，全天通行",
    gateRegistration: "无需提前登记，门岗查验学生证即可",
    notes: "国际学生楼，管理灵活",
  },
]

export const FAQ_ITEMS = [
  {
    q: "毕业季搬运需要提前多久申请？",
    a: "建议至少提前3天安排，热门时段（6月中旬）建议提前1周预约。",
  },
  {
    q: "大型家具（上床下桌/组合柜）怎么搬运？",
    a: "需要专业拆装，建议在发单时选择「较难拆装」标签，系统会匹配有拆装经验的师傅。",
  },
  {
    q: "校外买家进校搬运怎么办理？",
    a: "校外人员需在门岗登记身份证并缴纳押金，离校时归还临时出入证退押金。",
  },
  {
    q: "拼单配送怎么分摊费用？",
    a: "同车配送费按件数均摊，系统自动计算每单应付金额。",
  },
  {
    q: "交接码怎么使用？",
    a: "配送时买家向师傅出示交接码，师傅确认后完成交接。交接码在进度页查看。",
  },
  {
    q: "公益转赠和低价急出有什么区别？",
    a: "公益转赠表示免费赠送有需要的同学；低价急出表示以低于市场价急售，通常在3天内需要搬离。",
  },
]
