import React from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow
} from '@mui/material'
import { PositionTableRow } from './PositionsTableRow'
import { IPositionItem } from '../../../types'
import { useNavigate } from 'react-router-dom'
import { usePositionTableStyle } from './styles/positionTable'
import { EmptyPlaceholder } from '@components/EmptyPlaceholder/EmptyPlaceholder'

interface IPositionsTableProps {
  positions: Array<IPositionItem>
  isLockPositionModalOpen: boolean
  setIsLockPositionModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  noInitialPositions?: boolean
  onAddPositionClick?: () => void
}

export const PositionsTable: React.FC<IPositionsTableProps> = ({
  positions,
  isLockPositionModalOpen,
  setIsLockPositionModalOpen,
  noInitialPositions,
  onAddPositionClick
}) => {
  const { classes } = usePositionTableStyle({ isScrollHide: positions.length <= 5 })
  const navigate = useNavigate()

  return (
    <TableContainer className={classes.tableContainer}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow className={classes.headerRow}>
            <TableCell className={`${classes.headerCell} ${classes.pairNameCell}`}>
              Pair name
            </TableCell>
            <TableCell className={`${classes.headerCell} ${classes.feeTierCell}`}>
              Fee tier
            </TableCell>
            <TableCell className={`${classes.headerCell} ${classes.tokenRatioCell}`}>
              Token ratio
            </TableCell>
            <TableCell className={`${classes.headerCell} ${classes.valueCell}`}>Value</TableCell>
            <TableCell className={`${classes.headerCell} ${classes.feeCell}`}>Fee</TableCell>
            <TableCell className={`${classes.headerCell} ${classes.chartCell}`}>Chart</TableCell>
            <TableCell className={`${classes.headerCell} ${classes.actionCell}`}>Action</TableCell>
          </TableRow>
        </TableHead>
        {positions.length > 0 ? (
          <TableBody className={classes.tableBody}>
            {positions.map((position, index) => (
              <TableRow
                onClick={e => {
                  if (
                    !(e.target as HTMLElement).closest('.action-button') &&
                    !isLockPositionModalOpen
                  ) {
                    navigate(`/position/${position.id}`)
                  }
                }}
                key={position.poolAddress.toString() + index}
                className={classes.tableBodyRow}>
                <PositionTableRow
                  {...position}
                  isLockPositionModalOpen={isLockPositionModalOpen}
                  setIsLockPositionModalOpen={setIsLockPositionModalOpen}
                />
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <Box className={classes.tableBody}>
            <Box className={classes.emptyContainer}>
              <Box className={classes.emptyWrapper}>
                <EmptyPlaceholder
                  newVersion
                  height='408px'
                  desc={
                    noInitialPositions
                      ? 'Add your first position by pressing the button and start earning!'
                      : 'Did not find any matching positions'
                  }
                  onAction={onAddPositionClick}
                  withButton={noInitialPositions}
                />
              </Box>
            </Box>
          </Box>
        )}

        <TableFooter className={classes.tableFooter}>
          <TableRow className={classes.footerRow}>
            <TableCell className={`${classes.cellBase} ${classes.pairNameCell}`} />

            <TableCell className={`${classes.cellBase} ${classes.feeTierCell}`} />
            <TableCell className={`${classes.cellBase} ${classes.tokenRatioCell}`} />
            <TableCell className={`${classes.cellBase} ${classes.valueCell}`} />
            <TableCell className={`${classes.cellBase} ${classes.feeCell}`} />
            <TableCell className={`${classes.cellBase} ${classes.chartCell}`} />
            <TableCell className={`${classes.cellBase} ${classes.actionCell}`} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}
