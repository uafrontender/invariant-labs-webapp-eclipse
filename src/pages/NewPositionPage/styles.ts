import { theme } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingInline: 200,
      marginTop: 45,
      minHeight: '70vh',

      [theme.breakpoints.down('lg')]: {
        paddingInline: 40
      },

      [theme.breakpoints.down('md')]: {
        paddingInline: 90
      },

      [theme.breakpoints.down('sm')]: {
        paddingInline: 8
      }
    }
  }
})

export default useStyles
