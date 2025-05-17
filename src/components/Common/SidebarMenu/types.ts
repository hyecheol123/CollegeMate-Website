/**
 * Type definitions for Sidebar Menu Component
 * These interfaces are used to structure and control the behavior of the SidebarMenu,
 * including its items, styling, and layout logic.
 * @author Daekyun Kim <daekyun97@gmail.com>
 */

// 사이드바 전체의 속성 정의
export interface SidebarMenuProps {
  open: boolean; // 사이드바가 열려있는지 여부
  onClose: () => void; // 사이드바를 닫을 때 실행할 함수
  title?: string; // 사이드바 상단에 표시될 제목 (예: Notification, Setting..etc)
  items: SidebarMenuItem[]; // 사이드바에 표시될 메뉴 항목들
  itemSpacing?: number; // 메뉴 항목 사이의 간격
  showDivider?: boolean; // 항목들 사이에 구분선(divider)을 보여줄지 여부
}

// 사이드바의 한 줄(메뉴 항목)에 대한 정보
export interface SidebarMenuItem {
  label: string; // 첫 줄에 표시될 텍스트 (예: 제목)
  description?: string; // 두 번째 줄 (예: 노티 설명 등) - Optional
  onClick: () => void; // 클릭 시 실행할 함수
  icon?: React.ReactNode; // 오른쪽에 표시할 아이콘 (Optional)
  textVariant?: 'body1' | 'body2'; // label에 적용할 텍스트 스타일
  descriptionVariant?: 'body3'; // description에 적용할 텍스트 스타일 (Optional)
}

// 사이드바에서 개별 메뉴 항목을 렌더링할 때 사용할 props
export interface SidebarMenuItemProps {
  item: SidebarMenuItem; // 현재 표시할 메뉴 항목
  spacing: number; // 항목 간 간격
  showDivider: boolean; // 이 항목 아래에 구분선을 넣을지 여부
  isLast: boolean; // 마지막 항목인지 여부 (마지막이면 구분선 생략 가능)
}
