'use strict'

/**
 * 중고차 CRUD 화면에서 사용하는 DOM 요소를 한 곳에서 관리한다.
 * HTML selector가 변경되면 이 영역과 HTML을 함께 수정해야 한다.
 */
const usedCarForm = document.querySelector('#usedCarForm')
const usedCarMakerInput = document.querySelector('#usedCarMaker')
const usedCarModelInput = document.querySelector('#usedCarModel')
const usedCarYearInput = document.querySelector('#usedCarYear')
const usedCarMileageInput = document.querySelector('#usedCarMileage')
const usedCarPriceInput = document.querySelector('#usedCarPrice')
const usedCarFuelInput = document.querySelector('#usedCarFuel')
const usedCarStatusInput = document.querySelector('#usedCarStatus')

const usedCarSubmitButton = document.querySelector('#usedCarSubmitButton')
const usedCarCancelEditButton = document.querySelector(
  '#usedCarCancelEditButton',
)
const usedCarSearchInput = document.querySelector('#usedCarSearchInput')
const usedCarStatusFilter = document.querySelector('#usedCarStatusFilter')

const usedCarCountText = document.querySelector('#usedCarCountText')
const usedCarEmptyMessage = document.querySelector('#usedCarEmptyMessage')
const usedCarList = document.querySelector('#usedCarList')

/**
 * 화면 초기화 시 사용하는 차량 원본 데이터다.
 * 별도 저장소를 사용하지 않으므로 새로고침하면 이 데이터로 복원된다.
 */
let usedCars = [
  {
    id: 1,
    maker: '현대',
    model: '쏘나타',
    year: 2021,
    mileage: 43000,
    price: 1850,
    fuel: 'LPG',
    status: '판매중',
  },
  {
    id: 2,
    maker: '기아',
    model: 'K5',
    year: 2020,
    mileage: 52000,
    price: 1690,
    fuel: '가솔린',
    status: '예약중',
  },
]

/** null이면 등록 모드이며, 숫자 ID가 있으면 해당 차량의 수정 모드다. */
let editingCarId = null

renderUsedCars()

/**
 * 현재 검색어와 상태 필터를 적용한 차량 목록을 화면에 출력한다.
 */
function renderUsedCars() {
  const filteredCars = getFilteredUsedCars()

  usedCarList.replaceChildren()
  usedCarEmptyMessage.hidden = filteredCars.length > 0
  usedCarCountText.textContent =
    `전체 ${usedCars.length}대 / 표시 ${filteredCars.length}대`

  filteredCars.forEach(function (car) {
    usedCarList.appendChild(createUsedCarCard(car))
  })
}

/**
 * 검색어와 판매 상태 조건을 동시에 만족하는 차량만 반환한다.
 * 원본 배열은 변경하지 않는다.
 *
 * @returns {Array<object>} 화면에 표시할 차량 목록
 */
function getFilteredUsedCars() {
  const keyword = usedCarSearchInput.value.trim().toLowerCase()
  const selectedStatus = usedCarStatusFilter.value

  return usedCars.filter(function (car) {
    const searchText = `${car.maker} ${car.model}`.toLowerCase()
    const matchesKeyword = searchText.includes(keyword)
    const matchesStatus =
      selectedStatus === '전체' || car.status === selectedStatus

    return matchesKeyword && matchesStatus
  })
}

/**
 * 차량 객체를 표시하는 카드 DOM을 생성한다.
 *
 * @param {object} car 차량 정보
 * @returns {HTMLElement} 차량 카드
 */
function createUsedCarCard(car) {
  const card = document.createElement('article')
  card.className = 'used-car-card'

  const title = document.createElement('h3')
  title.className = 'used-car-card__title'
  title.textContent = `${car.maker} ${car.model}`

  const detail = document.createElement('p')
  detail.className = 'used-car-card__detail'
  detail.textContent =
    `${car.year}년식 · ${car.fuel} · ${car.mileage.toLocaleString()}km`

  const price = document.createElement('p')
  price.className = 'used-car-card__price'
  price.textContent = `${car.price.toLocaleString()}만원`

  const status = document.createElement('span')
  status.className =
    `used-car-status-badge ${getUsedCarStatusClass(car.status)}`
  status.textContent = car.status

  const actions = document.createElement('div')
  actions.className = 'used-car-card__actions'

  const editButton = document.createElement('button')
  editButton.type = 'button'
  editButton.className = 'used-car-button used-car-button--edit'
  editButton.dataset.action = 'edit'
  editButton.dataset.id = String(car.id)
  editButton.textContent = '수정'

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.className = 'used-car-button used-car-button--delete'
  deleteButton.dataset.action = 'delete'
  deleteButton.dataset.id = String(car.id)
  deleteButton.textContent = '삭제'

  actions.append(editButton, deleteButton)
  card.append(title, detail, price, status, actions)

  return card
}

/**
 * 입력 폼과 수정 상태를 초기 등록 상태로 복원한다.
 */
function resetUsedCarForm() {
  editingCarId = null
  usedCarForm.reset()
  usedCarSubmitButton.textContent = '등록'
  usedCarCancelEditButton.hidden = true
  usedCarModelInput.focus()
}

/**
 * 판매 상태에 대응하는 BEM modifier 클래스를 반환한다.
 *
 * @param {string} status 판매 상태
 * @returns {string} 상태 배지 modifier 클래스
 */
function getUsedCarStatusClass(status) {
  const statusClassMap = {
    판매중: 'used-car-status-badge--selling',
    예약중: 'used-car-status-badge--reserved',
    판매완료: 'used-car-status-badge--sold',
  }

  return statusClassMap[status] ?? 'used-car-status-badge--sold'
}

/**
 * 기존 ID와 중복되지 않는 신규 차량 ID를 생성한다.
 *
 * @returns {number} 신규 차량 ID
 */
function createNextUsedCarId() {
  if (usedCars.length === 0) {
    return 1
  }

  return Math.max(...usedCars.map(function (car) {
    return car.id
  })) + 1
}

/**
 * 등록 및 수정 완료를 하나의 submit 이벤트에서 처리한다.
 */
usedCarForm.addEventListener('submit', function (event) {
  event.preventDefault()

  const formCar = getUsedCarFromForm()

  if (formCar === null) {
    return
  }

  if (editingCarId === null) {
    usedCars.push({
      id: createNextUsedCarId(),
      ...formCar,
    })
  } else {
    const editingCarIndex = usedCars.findIndex(function (car) {
      return car.id === editingCarId
    })

    if (editingCarIndex === -1) {
      alert('수정할 차량 정보를 찾을 수 없습니다.')
      resetUsedCarForm()
      return
    }

    usedCars[editingCarIndex] = {
      id: editingCarId,
      ...formCar,
    }
  }

  renderUsedCars()
  resetUsedCarForm()
})

/**
 * 동적으로 생성되는 수정·삭제 버튼을 이벤트 위임으로 처리한다.
 */
usedCarList.addEventListener('click', function (event) {
  const actionButton = event.target.closest('button[data-action]')

  if (actionButton === null || !usedCarList.contains(actionButton)) {
    return
  }

  const carId = Number(actionButton.dataset.id)

  if (!Number.isInteger(carId)) {
    return
  }

  if (actionButton.dataset.action === 'edit') {
    startUsedCarEdit(carId)
    return
  }

  if (actionButton.dataset.action === 'delete') {
    deleteUsedCar(carId)
  }
})

usedCarSearchInput.addEventListener('input', renderUsedCars)
usedCarStatusFilter.addEventListener('change', renderUsedCars)

usedCarCancelEditButton.addEventListener('click', function () {
  resetUsedCarForm()
})

/**
 * 입력값을 검증하고 정상일 경우 차량 객체를 반환한다.
 *
 * @returns {object|null} 검증된 차량 정보 또는 검증 실패 시 null
 */
function getUsedCarFromForm() {
  const maker = usedCarMakerInput.value
  const model = usedCarModelInput.value.trim()
  const yearText = usedCarYearInput.value.trim()
  const mileageText = usedCarMileageInput.value.trim()
  const priceText = usedCarPriceInput.value.trim()
  const fuel = usedCarFuelInput.value
  const status = usedCarStatusInput.value

  const year = Number(yearText)
  const mileage = Number(mileageText)
  const price = Number(priceText)
  const currentYear = new Date().getFullYear()

  if (maker === '') {
    alert('제조사를 선택하세요.')
    usedCarMakerInput.focus()
    return null
  }

  if (model === '') {
    alert('모델명을 입력하세요.')
    usedCarModelInput.focus()
    return null
  }

  if (
    yearText === '' ||
    !Number.isInteger(year) ||
    year < 1990 ||
    year > currentYear
  ) {
    alert(
      `연식은 1990년부터 ${currentYear}년(현재 년도) 사이로 입력하세요.`,
    )
    usedCarYearInput.focus()
    return null
  }

  if (
    mileageText === '' ||
    !Number.isFinite(mileage) ||
    mileage < 0
  ) {
    alert('주행거리는 0이상 입력하세요.')
    usedCarMileageInput.focus()
    return null
  }

  if (
    priceText === '' ||
    !Number.isFinite(price) ||
    price < 1
  ) {
    alert('가격은 1이상 입력하세요.')
    usedCarPriceInput.focus()
    return null
  }

  if (fuel === '') {
    alert('연료를 선택하세요.')
    usedCarFuelInput.focus()
    return null
  }

  return {
    maker,
    model,
    year,
    mileage,
    price,
    fuel,
    status,
  }
}

/**
 * 선택한 차량 정보를 폼에 입력하고 수정 모드로 전환한다.
 *
 * @param {number} id 수정할 차량 ID
 */
function startUsedCarEdit(id) {
  const selectedCar = usedCars.find(function (car) {
    return car.id === id
  })

  if (selectedCar === undefined) {
    alert('수정할 차량 정보를 찾을 수 없습니다.')
    return
  }

  editingCarId = selectedCar.id
  usedCarMakerInput.value = selectedCar.maker
  usedCarModelInput.value = selectedCar.model
  usedCarYearInput.value = String(selectedCar.year)
  usedCarMileageInput.value = String(selectedCar.mileage)
  usedCarPriceInput.value = String(selectedCar.price)
  usedCarFuelInput.value = selectedCar.fuel
  usedCarStatusInput.value = selectedCar.status

  usedCarSubmitButton.textContent = '수정 완료'
  usedCarCancelEditButton.hidden = false
  usedCarModelInput.focus()
}

/**
 * 사용자 확인 후 선택한 차량을 원본 배열에서 제거한다.
 *
 * @param {number} id 삭제할 차량 ID
 */
function deleteUsedCar(id) {
  const selectedCar = usedCars.find(function (car) {
    return car.id === id
  })

  if (selectedCar === undefined) {
    alert('삭제할 차량 정보를 찾을 수 없습니다.')
    return
  }

  const shouldDelete = confirm('선택한 차량을 삭제할까요?')

  if (!shouldDelete) {
    return
  }

  usedCars = usedCars.filter(function (car) {
    return car.id !== id
  })

  if (editingCarId === id) {
    resetUsedCarForm()
  }

  renderUsedCars()
}
