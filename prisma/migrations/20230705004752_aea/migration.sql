-- CreateTable
CREATE TABLE `Employee` (
    `ID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `registeredOn` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
