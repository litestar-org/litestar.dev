function initDropdowns() {
    const dropdownToggles = document.querySelectorAll(".st-dropdown-toggle")

    const dropdowns = [...dropdownToggles].map(toggleEl => ({
        toggleEl,
        contentEL: toggleEl.parentElement.querySelector(".st-dropdown-menu")
    }))

    const close = (dropdown) => {
        const {toggleEl, contentEL} = dropdown
        toggleEl.setAttribute("aria-expanded", "false")
        contentEL.classList.toggle("hidden", true)
    }

    const open = (dropdown) => {
        dropdown.toggleEl.setAttribute("aria-expanded", "true")
        dropdown.contentEL.classList.toggle("hidden", false)
        const boundaries = [dropdown.contentEL, ...dropdownToggles]
        const clickOutsideListener = (event) => {
            const target = event.target
            if (!target) return

            if (!boundaries.some(b => b.contains(target))) {
                closeAll()
                document.removeEventListener("click", clickOutsideListener)
            }

        }
        document.addEventListener("click", clickOutsideListener)
    }

    const closeAll = () => dropdowns.forEach(close)

    dropdowns.forEach(dropdown => {
        dropdown.toggleEl.addEventListener("click", () => {
            closeAll()
            open(dropdown)
        })
    })
}

window.addEventListener("DOMContentLoaded", () => {
    initDropdowns()
})
