import { Box, Grid } from '@mui/material'
import icons from '@static/icons'
import { colors, typography } from '@static/theme'
import { useNavigate } from 'react-router-dom'

interface INormalBannerProps {
  onClose: () => void
  isHiding: boolean
}

export const NormalBanner = ({ onClose, isHiding }: INormalBannerProps) => {
  const navigate = useNavigate()
  const bannerHeight = 'fit-content'

  return (
    <Box
      sx={{
        position: 'relative',
        background: colors.invariant.light,
        padding: isHiding ? '0px 0px' : { xs: '12px 16px', sm: '10px 25px' },
        width: '100%',
        maxWidth: '100%',
        height: isHiding ? '0px' : bannerHeight,
        display: 'flex',
        ...typography.body1,
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        color: colors.invariant.text,
        margin: isHiding ? '0' : undefined,
        overflow: 'hidden',
        opacity: isHiding ? 0 : 1,
        transition: 'all 0.3s ease-in-out',
        willChange: 'height,padding,margin'
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          transform: isHiding ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease-in-out',
          position: 'relative',
          gap: '12px'
        }}>
        <Grid display='flex' justifyContent='center' alignItems='center' width='100%' mr={3}>
          <Box
            component='img'
            src={icons.airdrop}
            sx={{
              width: { xs: '20px', sm: '24px' },
              height: { xs: '20px', sm: '24px' },
              minWidth: { xs: '20px', sm: '24px' },
              objectFit: 'contain',
              marginRight: '12px'
            }}
          />
          <Box
            sx={{
              fontSize: { xs: '14px', sm: '16px' }
            }}>
            <span>
              Invariant Points new feature just started! Collect more points by exchanging tokens.
              Check it out!
              <span
                style={{
                  color: colors.invariant.pink,
                  textDecoration: 'underline',
                  marginLeft: '6px',
                  cursor: 'pointer',
                  ...typography.body1
                }}
                onClick={() => navigate('/exchange/ETH/USDC')}>
                here!
              </span>{' '}
              ... And see also distribution of points in the
              <span
                style={{
                  color: colors.invariant.pink,
                  textDecoration: 'underline',
                  marginLeft: '6px',
                  cursor: 'pointer',
                  ...typography.body1
                }}
                onClick={() => navigate('/points')}>
                leaderboard!
              </span>
            </span>
          </Box>
        </Grid>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: { xs: '8px', sm: '25px' },
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          color: colors.invariant.text,
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}>
        <Box
          component='img'
          src={icons.closeSmallIcon}
          sx={{
            width: { xs: '10px', sm: '11px' },
            height: { xs: '10px', sm: '11px' },
            minWidth: { xs: '10px', sm: '11px' }
          }}
          alt='Close'
        />
      </Box>
    </Box>
  )
}
