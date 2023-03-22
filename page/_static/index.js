function initDropdowns() {
    const dropdowns = document.querySelectorAll(".st-dropdown-menu")
    const dropdownToggles = document.querySelectorAll(".st-dropdown-toggle")

    const closeAll = () => {
        for (const dropdown of dropdowns) {
            dropdown.classList.toggle("hidden", true)
        }
    }

    for (const toggle of dropdownToggles) {
        toggle.addEventListener("click", event => {
            const menu = event?.target?.parentElement.querySelector(".st-dropdown-menu")
            if (!menu) {
                return
            }

            closeAll()

            menu.classList.toggle("hidden", false)

            const closeOnClickOutside = (event) => {
                const eventTarget = event?.target
                const boundaryElement = menu?.parentElement
                if (!(eventTarget && boundaryElement)) {
                    return
                }
                if (!boundaryElement.contains(eventTarget)) {
                    closeAll()
                    document.removeEventListener("click", closeOnClickOutside)
                }
            }
            document.addEventListener("click", closeOnClickOutside)
        })
    }
}

window.addEventListener("DOMContentLoaded", () => {
    initDropdowns()
})
